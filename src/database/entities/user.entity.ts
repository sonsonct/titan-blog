import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoleScope, UserStatus } from '../../commons/enums';
import { Article } from 'src/database/entities/article.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { Faq } from 'src/database/entities/faq.entity';
import { Notification } from './notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'varchar', length: '500' })
  public username: string;

  @Column({ type: 'varchar', length: '320', nullable: true })
  public email: string;

  @Column({ type: 'varchar', nullable: true })
  public avatar?: string;

  @Column({ type: 'varchar', length: '20', default: RoleScope.USER })
  public role: string;

  @Column({ type: 'varchar', nullable: true })
  public password: string;

  @Column({ type: 'int', default: UserStatus.ACTIVE })
  public status: number;

  @OneToMany(() => Article, (articles) => articles.author)
  articles: Article[]

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[]

  @OneToMany(() => Faq, (faq) => faq.author)
  faq: Faq[]

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[]
}
