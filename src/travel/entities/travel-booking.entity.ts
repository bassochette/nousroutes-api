import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Travel } from './travel.entity';

@ObjectType()
@Entity()
export class TravelBooking {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    description: 'generated unique id',
  })
  uuid: string;

  @ManyToOne(() => Travel, (travel) => travel.bookings)
  @Field(() => Travel)
  travel: Travel;

  @Column()
  @Field(() => Int)
  seats: number;

  @Column()
  @Field(() => Boolean)
  confirmed: boolean;

  @Column()
  @Field(() => String, {
    description: 'client email',
  })
  client: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
