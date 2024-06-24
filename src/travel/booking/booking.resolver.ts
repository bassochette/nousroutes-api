import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { TravelBooking } from './enitities/travel-booking.entity';
import { BookingReservationInput } from '../dto/booking-reservation.input';
import { BookingConfirmationInput } from '../dto/booking-confirmation.input';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => TravelBooking, { name: 'bookingByUuid' })
  getBookingByUuid(@Args('uuid', { type: () => String }) uuid: string) {
    return this.bookingService.getBookingByUuid(uuid);
  }

  @Mutation(() => TravelBooking)
  bookingReservation(
    @Args('bookingReservationInput')
    bookingReservationInput: BookingReservationInput,
  ) {
    return this.bookingService.bookingReservation(bookingReservationInput);
  }

  @Mutation(() => TravelBooking)
  bookingConfirmation(
    @Args('bookingConfirmationInput')
    bookingConfirmationInput: BookingConfirmationInput,
  ) {
    return this.bookingService.bookingConfirmation(bookingConfirmationInput);
  }
}
