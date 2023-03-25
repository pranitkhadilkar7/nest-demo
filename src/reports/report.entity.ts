import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  private id: number

  @Column()
  price: number
}
