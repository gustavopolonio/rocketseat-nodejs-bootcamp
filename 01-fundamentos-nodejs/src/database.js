import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(async () => {
        await this.#persist()
      })
  }

  async #persist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    return this.#database[table] ?? []
  }

  async insert(table, data) {
    if (Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    await this.#persist()

    return data
  }
}