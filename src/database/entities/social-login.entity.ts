import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocialLogin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    socialId: string;

    @Column({ type: 'bigint' })
    userId: number;

    @Column()
    socialName: string;
}