import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { BookingReservationInput } from './dto/booking-reservation.input';
import { TravelBooking } from './entities/travel-booking.entity';
import { NotEnoughSeatsException } from './exceptions/not-enough-seats.exception';
import { TravelNotFoundException } from './exceptions/travel-not-found.exception';
import { BookingConfirmationInput } from './dto/booking-confirmation.input';
import { BookingExpiredException } from './exceptions/booking-expired.exception';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    @InjectRepository(TravelBooking)
    private readonly travelBookingRepository: Repository<TravelBooking>,
  ) {}

  findAll() {
    return this.travelRepository.find({});
  }

  findOne(uuid: string) {
    return this.travelRepository.findOne({
      where: {
        uuid,
      },
    });
  }

  async bookingReservation(bookingReservationInput: BookingReservationInput) {
    const travel = await this.findOne(bookingReservationInput.travelUuid);

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

    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setHours(
      fifteenMinutesAgo.getHours(),
      fifteenMinutesAgo.getMinutes() - 15,
    );

    if (booking.createdAt < fifteenMinutesAgo) {
      throw new BookingExpiredException(booking.uuid);
    }

    booking.confirmed = true;

    await this.travelBookingRepository.save(booking);

    return booking;
  }
}
