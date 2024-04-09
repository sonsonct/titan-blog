import { User } from "src/database/entities/user.entity";
import { Category } from "src/database/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Faq {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    public categoryId: number;

    @Column({ nullable: true })
    public authorId: number;

    @Column({ type: "text", nullable: false })
    public question: string;

    @Column({ type: "text", nullable: false })
    public answer: string;

    @Column({ nullable: false })
    public isPublic: boolean;

    @ManyToOne(() => Category, category => category.faq, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => User, user => user.faq, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: User;
}