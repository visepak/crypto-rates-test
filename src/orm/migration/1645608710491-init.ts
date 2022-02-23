import {MigrationInterface, QueryRunner} from "typeorm";

export class init1645608710491 implements MigrationInterface {
    name = 'init1645608710491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "config" ("sym" character varying NOT NULL, "is_fsym" boolean NOT NULL, "is_tsym" boolean NOT NULL, CONSTRAINT "UQ_7d72dc4070be17bac27c88817e3" UNIQUE ("sym"), CONSTRAINT "PK_7d72dc4070be17bac27c88817e3" PRIMARY KEY ("sym"))`);
        await queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "fsym" character varying NOT NULL, "tsym" character varying NOT NULL, "price" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "price"`);
        await queryRunner.query(`DROP TABLE "config"`);
    }

}
