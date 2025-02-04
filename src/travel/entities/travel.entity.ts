import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TravelBooking } from '../booking/enitities/travel-booking.entity';
import { Moods } from './moods.gql-object-type';
import { getFifteenMinutesAgo } from '../../utils/fifteen-minutes-ago';

const TRAVEL_CAPACITY = 5;

@ObjectType()
@Entity()
export class Travel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Travel unique UUID', name: 'uuid' })
  uuid: string;

  @Column({
    unique: true,
  })
  @Field(() => String, {
    description: 'travel slug',
  })
  slug: string;

  @Column()
  @Field(() => String, {
    description: 'travel name',
  })
  name: string;

  @Column()
  @Field(() => String, {
    description: 'travel description',
  })
  description: string;

  @Column()
  @Field(() => Date, {
    description: 'travel starting date',
  })
  startingDate: Date;

  @Column()
  @Field(() => Date, {
    description: 'travel ending date',
  })
  endingDate: Date;

  @Column()
  @Field(() => Int, {
    description: 'travel price in cents',
  })
  price: number;

  // not returned nor displayed by the graphql API
  @OneToMany(() => TravelBooking, (booking) => booking.travel, {
    eager: true,
  })
  bookings: TravelBooking[];

  @Field(() => Int, {
    description: 'number of available seats',
  })
  get availableSeats() {
    const fifteenMinutesAgo = getFifteenMinutesAgo();

    const booked = this.bookings.reduce((carry, item) => {
      if (item.confirmed || +item.createdAt > +fifteenMinutesAgo) {
        return carry + item.seats;
      }

      return carry;
    }, 0);
    return TRAVEL_CAPACITY - booked;
  }

  // Quick solution, in real life a OneToMany relation would be better and allow to use as many moods as wanted
  @Column({
    type: 'simple-json',
  })
  @Field(() => Moods)
  moods: Moods;

  @CreateDateColumn()
  @Field(() => Date, {
    description: 'travel creation date',
  })
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
