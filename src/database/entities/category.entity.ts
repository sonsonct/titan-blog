import { Article } from "src/database/entities/article.entity";
import { Faq } from "src/database/entities/faq.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column({ nullable: true })
    parentId: number;

    @Column({ nullable: false, type: "varchar", length: 255, unique: true })
    categoryName: string;

    @Column({ type: 'bigint', nullable: true, unique: true })
    order: number;

    @ManyToOne(() => Category, (category) => category.subCategories, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parentCategory: Category;

    @OneToMany(() => Category, (category) => category.parentCategory, { nullable: true })
    subCategories: Category[];

    @OneToMany(() => Article, (articles) => articles.category)
    articles: Article[]

    @OneToMany(() => Faq, (faq) => faq.category)
    faq: Faq[]
}

