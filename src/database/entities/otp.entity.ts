import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OtpStatus } from '../../commons/enums';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'varchar', length: '6' })
  public otpCode: string;

  @Column({ type: 'int', default: OtpStatus.CREATED })
  public status: number;

  @Column({ type: 'timestamp' })
  public expirationTime: Date;
}
