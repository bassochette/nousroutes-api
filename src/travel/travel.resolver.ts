import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { BookingReservationInput } from './dto/booking-reservation.input';
import { TravelBooking } from './entities/travel-booking.entity';

@Resolver(() => Travel)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) {}

  @Query(() => [Travel], { name: 'travel' })
  findAll() {
    return this.travelService.findAll();
  }

  @Query(() => Travel, { name: 'travelByUuid' })
  findOne(@Args('uuid', { type: () => String }) uuid: string) {
    return this.travelService.findOne(uuid);
  }

  @Mutation(() => TravelBooking)
  bookingReservation(
    @Args('bookingReservationInput')
    bookingReservationInput: BookingReservationInput,
  ) {
    return this.travelService.bookingReservation(bookingReservationInput);
  }

  // TODO mutation book confirmation
}
