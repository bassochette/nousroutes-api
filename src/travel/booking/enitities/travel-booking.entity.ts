import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Travel } from '../../entities/travel.entity';
import { getFifteenMinutesAgo } from '../../../utils/fifteen-minutes-ago';

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

  @Field(() => Boolean, {
    description: 'booking expires 15 minutes after their creation',
  })
  get expired() {
    const fifteenMinutesAgo = getFifteenMinutesAgo();
    return +this.createdAt <= +fifteenMinutesAgo && !this.confirmed;
  }

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
