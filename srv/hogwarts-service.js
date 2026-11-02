const cds = require('@sap/cds')
const BASE = (process.env.HOGWARTS_API_URL || 'https://hogwarts-api.com/api').replace(/\/+$/, '')
const CACHE_TTL = 5 * 60 * 1000

let charactersCache
let cacheExpiresAt = 0
let charactersRequest

// collects the values for a field from the $filter that Fiori elements sends
function filterValues(where = [], field) {
  const out = []
  for (let i = 0; i < where.length; i++) {
    const t = where[i]
    if (t.xpr) out.push(...filterValues(t.xpr, field))
    if (t.ref?.[0] === field) {
      const v = where[i + 2]
      if (v?.val != null) out.push(v.val)
      else if (v?.list) out.push(...v.list.map(x => x.val))
    }
  }
  return out
}

const toRow = character => ({
  ID: character.id,
  name: character.name,
  house: character.house,
  species: character.species,
  gender: character.gender,
  image: character.image
})

async function requestJson(path) {
  const response = await fetch(`${BASE}${path}`)
  if (!response.ok) {
    const error = new Error(`Hogwarts API returned HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

async function getCharacters() {
  if (charactersCache && Date.now() < cacheExpiresAt) return charactersCache

  if (!charactersRequest) {
    charactersRequest = requestJson('/characters')
      .then(body => {
        if (!Array.isArray(body.data)) {
          throw new Error('Hogwarts API returned an invalid characters response')
        }
        charactersCache = body.data
        cacheExpiresAt = Date.now() + CACHE_TTL
        return charactersCache
      })
      .finally(() => {
        charactersRequest = undefined
      })
  }

  return charactersRequest
}

function upstreamError(req, error) {
  const status = error.status === 404 ? 404 : 502
  return req.reject(status, error.message || 'Hogwarts API request failed')
}

module.exports = class HogwartsService extends cds.ApplicationService {
  async init() {
    const { Characters, CharacterBooks, Houses } = this.entities

    this.on('READ', Houses, () => [
      { house: 'Gryffindor' },
      { house: 'Hufflepuff' },
      { house: 'Ravenclaw' },
      { house: 'Slytherin' }
    ])

    this.on('READ', Characters, async (req) => {
      const [key] = req.params
      if (key) {
        const id = typeof key === 'object' ? key.ID : key
        if (id == null) return req.reject(400, 'Character ID is required')
        try {
          const character = (await getCharacters()).find(item => item.id === String(id))
          if (!character) return req.reject(404, `Character ${id} not found`)
          return toRow(character)
        } catch (error) {
          return upstreamError(req, error)
        }
      }

      const { limit, search, where } = req.query.SELECT
      const requestedSize = Number(limit?.rows?.val ?? 25)
      const requestedOffset = Number(limit?.offset?.val ?? 0)
      const size = Number.isFinite(requestedSize) ? Math.max(0, requestedSize) : 25
      const offset = Number.isFinite(requestedOffset) ? Math.max(0, requestedOffset) : 0
      const query = search?.map(token => token.val).filter(Boolean).join(' ').toLocaleLowerCase()
      const ids = filterValues(where, 'ID').map(id => String(id))
      const names = filterValues(where, 'name').map(name => String(name).toLocaleLowerCase())
      const houses = filterValues(where, 'house').map(house => String(house).toLocaleLowerCase())

      try {
        const characters = await getCharacters()
        const matching = characters
          .filter(character => !ids.length || ids.includes(String(character.id)))
          .filter(character => !names.length || names.includes((character.name || '').toLocaleLowerCase()))
          .filter(character => !query || character.name?.toLocaleLowerCase().includes(query))
          .filter(character => !houses.length || houses.includes((character.house || '').toLocaleLowerCase()))
        const rows = matching.slice(offset, offset + size).map(toRow)
        rows.$count = matching.length
        return rows
      } catch (error) {
        return upstreamError(req, error)
      }
    })

    // books of one character, read from the SQLite cache
    this.on('READ', CharacterBooks, async (req, next) => {
      const [parent] = req.params
      if (!parent) return next()
      const id = typeof parent === 'object' ? parent.ID : parent
      // later: if nothing is cached, call the Gemini iFlow here and insert the rows
      return cds.db.run(SELECT.from('hogwarts.CharacterBooks').where({ characterID: id }))
    })

    return super.init()
  }
}