import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Statistical {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @Column({ type: 'date' })
    public date: Date;

    @Column({ nullable: false, default: 0 })
    public viewCount: number;

    @Column({ nullable: false, default: 0 })
    public likeCount: number;

    @Column({ nullable: false, default: 0 })
    public commentCount: number;
}