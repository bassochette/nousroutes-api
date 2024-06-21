import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BookingConfirmationInput {
  @Field(() => String, { description: 'booking uuid' })
  bookingUuid: string;
}
