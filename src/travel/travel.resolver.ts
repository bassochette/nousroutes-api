import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { BookingReservationInput } from './dto/booking-reservation.input';
import { TravelBooking } from './entities/travel-booking.entity';
import { BookingConfirmationInput } from './dto/booking-confirmation.input';

@Resolver(() => Travel)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) {}

  @Query(() => [Travel], { name: 'travel' })
  findAll() {
    return this.travelService.findAll();
  }

  @Query(() => Travel, { name: 'travelBySlug' })
  findOne(@Args('slug', { type: () => String }) slug: string) {
    return this.travelService.findOneBySlug(slug);
  }

  @Mutation(() => TravelBooking)
  bookingReservation(
    @Args('bookingReservationInput')
    bookingReservationInput: BookingReservationInput,
  ) {
    return this.travelService.bookingReservation(bookingReservationInput);
  }

  @Mutation(() => TravelBooking)
  bookingConfirmation(
    @Args('bookingConfirmationInput')
    bookingConfirmationInput: BookingConfirmationInput,
  ) {
    return this.travelService.bookingConfirmation(bookingConfirmationInput);
  }
}
