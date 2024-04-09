import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { Category } from 'src/database/entities/category.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { Notification } from 'src/database/entities/notification.entity';
import { Hashtag } from './hashtag.entity';

@Entity()
@Index('idx_title_content_fulltext', ['title', 'content'], { fulltext: true })
export class Article {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    public authorId: number;

    @Column({ type: 'boolean', nullable: false })
    public isPublic: boolean;

    @Column({ nullable: true })
    public categoryId: number;

    @Column({ type: 'varchar', length: '500', nullable: false })
    public title: string;

    @Column({ type: 'text', nullable: true })
    public thumbnail: string;

    @Column({ type: 'text', nullable: false })
    public content: string;

    @Column({ nullable: false, default: 0 })
    public viewCount: number;

    @Column({ nullable: false, default: false })
    public deleted: boolean;

    @Column({ nullable: false, default: 0 })
    public likeCount: number;

    @Column({ nullable: false, default: 0 })
    public commentCount: number;

    @ManyToOne(() => User, user => user.articles, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'authorId' })
    author: User;

    @ManyToOne(() => Category, category => category.articles, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToMany(() => Hashtag)
    @JoinTable({ name: 'article_hashtag' })
    hashtags: Hashtag[]

    @OneToMany(() => Comment, (comments) => comments.article)
    comments: Comment[]

    @ManyToMany(() => User)
    @JoinTable({ name: 'article_user_like' })
    likes: User[];

    @OneToMany(() => Notification, (notifications) => notifications.article)
    notifications: Notification[]
}
