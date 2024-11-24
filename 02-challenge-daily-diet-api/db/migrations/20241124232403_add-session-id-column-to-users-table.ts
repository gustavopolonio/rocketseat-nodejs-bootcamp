import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', (table) => {
    table.uuid('session_id').index().after('id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable('users', (table) => {
    table.dropColumn('session_id')
  })
}
