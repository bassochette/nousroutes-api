import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelBooking } from './enitities/travel-booking.entity';
import { Repository } from 'typeorm';
import { BookingReservationInput } from '../dto/booking-reservation.input';
import { TravelNotFoundException } from '../exceptions/travel-not-found.exception';
import { NotEnoughSeatsException } from '../exceptions/not-enough-seats.exception';
import { BookingConfirmationInput } from '../dto/booking-confirmation.input';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';
import { getFifteenMinutesAgo } from '../../utils/fifteen-minutes-ago';
import { BookingExpiredException } from './exceptions/booking-expired.exception';
import { TravelService } from '../travel.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(TravelBooking)
    private readonly travelBookingRepository: Repository<TravelBooking>,
    private readonly travelService: TravelService,
  ) {}

  getBookingByUuid(uuid: string) {
    return this.travelBookingRepository.findOne({
      where: {
        uuid,
      },
      relations: ['travel'],
    });
  }

  getBookingByEmail(email: string) {
    return this.travelBookingRepository.find({
      where: [
        {
          client: email,
          confirmed: true,
        },
        {
          client: email,
          createdAt: MoreThan(getFifteenMinutesAgo()),
        },
      ],
      relations: ['travel'],
    });
  }

  async bookingReservation(bookingReservationInput: BookingReservationInput) {
    const travel = await this.travelService.findOneByUuid(
      bookingReservationInput.travelUuid,
    );

    if (!travel) {
      throw new TravelNotFoundException(bookingReservationInput.travelUuid);
    }

    if (travel.availableSeats < bookingReservationInput.seats) {
      throw new NotEnoughSeatsException();
    }

    const booking = this.travelBookingRepository.create({
      travel,
      confirmed: false,
      seats: bookingReservationInput.seats,
      client: bookingReservationInput.email,
    });

    await this.travelBookingRepository.save(booking);

    return booking;
  }

  async bookingConfirmation(
    bookingConfirmationInput: BookingConfirmationInput,
  ): Promise<TravelBooking> {
    const booking = await this.travelBookingRepository.findOne({
      where: {
        uuid: bookingConfirmationInput.bookingUuid,
      },
      relations: ['travel'],
    });

    if (!booking) {
      throw new BookingNotFoundException(bookingConfirmationInput.bookingUuid);
    }

    const fifteenMinutesAgo = getFifteenMinutesAgo();

    if (booking.createdAt < fifteenMinutesAgo) {
      throw new BookingExpiredException(booking.uuid);
    }

    booking.confirmed = true;

    await this.travelBookingRepository.save(booking);

    return booking;
  }
}
