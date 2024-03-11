import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableRoles1710149125753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('roles', true)
    }

}
