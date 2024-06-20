import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field } from '@nestjs/graphql';
import { Travel } from './travel.entity';

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
  @Field(() => Boolean)
  confirmed: boolean;

  @Column()
  @Field(() => String, {
    description: 'client email',
  })
  client: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
