import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').index().after('id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}
