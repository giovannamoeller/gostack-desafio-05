import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTransaction1598927194979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await queryRunner.createTable(new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'title',
            type: 'varchar'
          },
          {
            name: 'type',
            type: 'varchar'
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 10,
            scale: 2
          },
          {
            name: 'category_id',
            type: 'uuid'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      }));

      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'CategoryId',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('transactions', 'CategoryId');
      await queryRunner.dropTable('transactions');
    }

}
