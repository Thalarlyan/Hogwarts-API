const cds = require('@sap/cds')
const BASE = process.env.HOGWARTS_API_URL || 'https://api.potterdb.com/v1'

// collects the house values from the $filter that Fiori elements sends
function houseValues(where = []) {
  const out = []
  for (let i = 0; i < where.length; i++) {
    const t = where[i]
    if (t.xpr) out.push(...houseValues(t.xpr))
    if (t.ref?.[0] === 'house') {
      const v = where[i + 2]
      if (v?.val != null) out.push(v.val)
      else if (v?.list) out.push(...v.list.map(x => x.val))
    }
  }
  return out
}

const toRow = c => ({
  ID: c.id,
  name: c.attributes.name,
  house: c.attributes.house,
  species: c.attributes.species,
  gender: c.attributes.gender,
  image: c.attributes.image
})

module.exports = class HogwartsService extends cds.ApplicationService {
  async init() {
    const { Characters, CharacterBooks } = this.entities

    this.on('READ', Characters, async (req) => {
      // profile page: one character by key
      const [key] = req.params
      if (key) {
        const id = typeof key === 'object' ? key.ID : key
        const res = await fetch(`${BASE}/characters/${id}`)
        if (!res.ok) return req.reject(502, `Upstream error ${res.status}`)
        return toRow((await res.json()).data)
      }

      // list page: paging, search, house filter
      const { limit, search, where } = req.query.SELECT
      const size = limit?.rows?.val ?? 25
      const offset = limit?.offset?.val ?? 0
      const params = new URLSearchParams({
        'page[size]': size,
        'page[number]': Math.floor(offset / size) + 1
      })
      const q = search?.map(s => s.val).filter(Boolean).join(' ')
      if (q) params.set('filter[name_cont]', q)
      houseValues(where).forEach(h => params.append('filter[house_in][]', h))

      const res = await fetch(`${BASE}/characters?${params}`)
      if (!res.ok) return req.reject(502, `Upstream error ${res.status}`)
      const body = await res.json()
      const rows = body.data.map(toRow)
      rows.$count = body.meta?.pagination?.records ?? rows.length
      return rows
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