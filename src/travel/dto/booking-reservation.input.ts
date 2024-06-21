import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class BookingReservationInput {
  @Field(() => Int, { description: 'number of seats requested' })
  seats: number;

  @Field(() => String, { description: 'email used for reservation' })
  email: string;

  @Field(() => String, { description: 'travel uuid' })
  travelUuid: string;
}
