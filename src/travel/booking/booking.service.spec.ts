import { BookingService } from './booking.service';
import { getTestingModuleWihInMemoryDB } from '../../../test/utils/get-testing-module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from '../entities/travel.entity';
import { TravelBooking } from './enitities/travel-booking.entity';
import { TravelService } from '../travel.service';
import { Repository } from 'typeorm';
import { NotEnoughSeatsException } from '../exceptions/not-enough-seats.exception';
import { TravelNotFoundException } from '../exceptions/travel-not-found.exception';
import { BookingExpiredException } from './exceptions/booking-expired.exception';

describe('BookingService', () => {
  let bookingService: BookingService;
  let travelBookingRepository: Repository<TravelBooking>;
  let travels: Travel[];
  let travelService: TravelService;

  beforeEach(async () => {
    const module = await getTestingModuleWihInMemoryDB({
      imports: [TypeOrmModule.forFeature([Travel, TravelBooking])],
      providers: [BookingService, TravelService],
    });

    bookingService = module.get<BookingService>(BookingService);
    travelBookingRepository = module.get<Repository<TravelBooking>>(
      getRepositoryToken(TravelBooking),
    );

    const travelRepo = module.get<Repository<Travel>>(
      getRepositoryToken(Travel),
    );
    travels = await travelRepo.find();
    travelService = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(bookingService).toBeDefined();
  });

  it('find by uuid', async () => {
    const booking = travelBookingRepository.create({
      travel: travels[0],
      seats: 2,
      client: 'julien@webeleon.dev',
      confirmed: false,
    });
    await travelBookingRepository.save(booking);

    const foundBooking = await bookingService.getBookingByUuid(booking.uuid);

    expect(foundBooking.uuid).toBe(booking.uuid);
    expect(foundBooking.travel.name).toBe(booking.travel.name);
  });

  describe('booking reservation', () => {
    let travel: Travel;
    beforeEach(async () => {
      travel = travels[0];
    });
    it('should allow the reservation', async () => {
      const booking = await bookingService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });

      expect(booking).toMatchObject({
        client: 'julien@webeleon.dev',
        seats: 3,
        travel: {
          uuid: travel.uuid,
        },
        confirmed: false,
      });
    });

    it('should block if their is not enough seats', async () => {
      await expect(
        bookingService.bookingReservation({
          email: 'julien@webeleon.dev',
          seats: 6,
          travelUuid: travel.uuid,
        }),
      ).rejects.toThrowError(NotEnoughSeatsException);
    });

    it('should throw an error if the travel does not exist', async () => {
      await expect(
        bookingService.bookingReservation({
          email: 'julien@webeleon.dev',
          seats: 3,
          travelUuid: '55ae1241-2623-4bab-9f03-72fee0474919',
        }),
      ).rejects.toThrowError(TravelNotFoundException);
    });

    it('should release the seat after 15 minutes', async () => {
      const booking = await bookingService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });

      const travelAfterBooking = await travelService.findOneByUuid(travel.uuid);
      expect(travelAfterBooking.availableSeats).toBe(2);

      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setHours(
        fifteenMinutesAgo.getHours(),
        fifteenMinutesAgo.getMinutes() - 15,
      );
      booking.createdAt = fifteenMinutesAgo;
      await travelBookingRepository.save(booking);

      const travelFifteenMinutesAfterBooking =
        await travelService.findOneByUuid(travel.uuid);
      expect(travelFifteenMinutesAfterBooking.availableSeats).toBe(5);
    });
  });

  describe('booking confirmation', () => {
    let travel: Travel;

    beforeEach(async () => {
      travel = travels[0];
    });

    it('should allow the confirmation', async () => {
      const booking = await bookingService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });

      const bookingConfirmed = await bookingService.bookingConfirmation({
        bookingUuid: booking.uuid,
      });

      expect(bookingConfirmed.confirmed).toBe(true);

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      bookingConfirmed.createdAt = oneHourAgo;
      await travelBookingRepository.save(bookingConfirmed);

      const travelOneHourAfterBooking = await travelService.findOneByUuid(
        travel.uuid,
      );
      expect(travelOneHourAfterBooking.availableSeats).toBe(2);
    });

    it('should block the confirmation after 15minutes', async () => {
      const booking = await bookingService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });
      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setHours(
        fifteenMinutesAgo.getHours(),
        fifteenMinutesAgo.getMinutes() - 15,
      );
      booking.createdAt = fifteenMinutesAgo;
      await travelBookingRepository.save(booking);

      await expect(
        bookingService.bookingConfirmation({
          bookingUuid: booking.uuid,
        }),
      ).rejects.toThrowError(BookingExpiredException);
    });
  });
});
