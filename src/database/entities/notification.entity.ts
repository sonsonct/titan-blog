import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Article } from "./article.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public title: string;

    @Column()
    public userId: number;

    @Column()
    public articleId: number;

    @Column()
    public type: string;

    @Column({ default: false })
    public isRead: boolean;

    @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Article, article => article.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: Article;
}