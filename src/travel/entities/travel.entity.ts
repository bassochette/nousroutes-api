import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TravelBooking } from './travel-booking.entity';
import { Moods } from './moods.gql-object-type';

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
    const booked = this.bookings.reduce((carry, item) => {
      if (item.confirmed) {
        return carry + 1;
      }
      const fifteenMinutesAgo = new Date(+new Date() - 15 * 60);

      if (item.createdAt > fifteenMinutesAgo) {
        return carry + 1;
      }
      return carry;
    }, 0);

    return TRAVEL_CAPACITY - booked;
  }

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
