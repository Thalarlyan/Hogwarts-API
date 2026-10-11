const cds = require('@sap/cds')
const BASE = process.env.HOGWARTS_API_URL || 'https://api.potterdb.com/v1'

module.exports = class HogwartsService extends cds.ApplicationService {
  async init() {
    this.on('characters', async (req) => {
      const { page = 1, size = 25, q } = req.data
      const params = new URLSearchParams({ 'page[number]': page, 'page[size]': size })
      if (q) params.set('filter[name_cont]', q)

      const res = await fetch(`${BASE}/characters?${params}`)
      if (!res.ok) return req.error(502, `Upstream error ${res.status}`)
      return JSON.stringify(await res.json())
    })
    return super.init()
  }
}