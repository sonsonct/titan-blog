import { Article } from "src/database/entities/article.entity";
import { User } from "src/database/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index('idx_title_content_fulltext', ['content'], { fulltext: true })
export class Comment {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    public parentId: number;

    @Column({ nullable: false })
    public articleId: number;

    @Column({ nullable: false })
    public userId: number;

    @Column({ type: 'text', nullable: false })
    public content: string;

    @Column({ nullable: false, default: false })
    public deleted: boolean;

    @ManyToOne(() => Article, article => article.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: Article;

    @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Comment, (comment) => comment.subComments, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parentComment: Comment;

    @OneToMany(() => Comment, (comment) => comment.parentComment, { nullable: true })
    subComments: Comment[];

    @ManyToMany(() => User)
    @JoinTable({ name: 'comment_user_like' })
    likes: User[];
}