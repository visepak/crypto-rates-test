import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'config', schema: 'public' })
@Unique(['sym'])
export class ConfigEntity {

    @PrimaryColumn()
    sym: string

    @Column({ name: 'is_fsym', nullable: false })
    isFsym: boolean;

    @Column({ name: 'is_tsym', nullable: false })
    isTsym: boolean;
}
