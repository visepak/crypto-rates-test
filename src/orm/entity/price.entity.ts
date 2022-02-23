import { TFsym, TConvertedPrice, TTsym } from '../../service/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'price', schema: 'public' })
export class PriceEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @Column({ name: 'fsym', nullable: false })
    fsym: TFsym;

    @Column({ name: 'tsym', nullable: false })
    tsym: TTsym;

    @Column({ name: 'price', type: 'json', nullable: false })
    price: TConvertedPrice;

    @CreateDateColumn({ name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;
}
