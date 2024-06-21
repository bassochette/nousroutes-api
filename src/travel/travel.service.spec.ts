import { TravelService } from './travel.service';
import { getTestingModuleWihInMemoryDB } from '../../test/utils/get-testing-module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelBooking } from './entities/travel-booking.entity';
import { travelSeeds } from '../migrations/seeds/travels';
import { NotEnoughSeatsException } from './exceptions/not-enough-seats.exception';
import { TravelNotFoundException } from './exceptions/travel-not-found.exception';
import { Repository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { BookingExpiredException } from './exceptions/booking-expired.exception';

describe('travel service', () => {
  let travelService: TravelService;
  let module: TestingModule;
  let travelBookingRepo: Repository<TravelBooking>;

  beforeEach(async () => {
    module = await getTestingModuleWihInMemoryDB({
      imports: [TypeOrmModule.forFeature([Travel, TravelBooking])],
      providers: [TravelService],
    });

    travelService = module.get<TravelService>(TravelService);
    travelBookingRepo = module.get<Repository<TravelBooking>>(
      getRepositoryToken(TravelBooking),
    );
  });

  it('should return the list of all travel', async () => {
    const travels = await travelService.findAll();
    expect(travels.length).toBe(travelSeeds.length);
  });

  it('should return a travel by uuid', async () => {
    const travels = await travelService.findAll();

    const firstTravel = await travelService.findOne(travels[0].uuid);

    expect(firstTravel).toStrictEqual(travels[0]);
  });

  describe('booking reservation', () => {
    let travel: Travel;
    beforeEach(async () => {
      const travels = await travelService.findAll();
      travel = travels[0];
    });
    it('should allow the reservation', async () => {
      const booking = await travelService.bookingReservation({
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

      const travelWithReservation = await travelService.findOne(travel.uuid);
      expect(travelWithReservation.availableSeats).toBe(2);
    });

    it('should block if their is not enough seats', async () => {
      await expect(
        travelService.bookingReservation({
          email: 'julien@webeleon.dev',
          seats: 6,
          travelUuid: travel.uuid,
        }),
      ).rejects.toThrowError(NotEnoughSeatsException);
    });

    it('should throw an error if the travel does not exist', async () => {
      await expect(
        travelService.bookingReservation({
          email: 'julien@webeleon.dev',
          seats: 3,
          travelUuid: '55ae1241-2623-4bab-9f03-72fee0474919',
        }),
      ).rejects.toThrowError(TravelNotFoundException);
    });

    it('should release the seat after 15 minutes', async () => {
      const booking = await travelService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });

      const travelAfterBooking = await travelService.findOne(travel.uuid);
      expect(travelAfterBooking.availableSeats).toBe(2);

      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setHours(
        fifteenMinutesAgo.getHours(),
        fifteenMinutesAgo.getMinutes() - 15,
      );
      booking.createdAt = fifteenMinutesAgo;
      await travelBookingRepo.save(booking);

      const travelFifteenMinutesAfterBooking = await travelService.findOne(
        travel.uuid,
      );
      expect(travelFifteenMinutesAfterBooking.availableSeats).toBe(5);
    });
  });

  describe('booking confirmation', () => {
    let travel: Travel;

    beforeEach(async () => {
      const travels = await travelService.findAll();
      travel = travels[0];
    });

    it('should allow the confirmation', async () => {
      const booking = await travelService.bookingReservation({
        email: 'julien@webeleon.dev',
        seats: 3,
        travelUuid: travel.uuid,
      });

      const bookingConfirmed = await travelService.bookingConfirmation({
        bookingUuid: booking.uuid,
      });

      expect(bookingConfirmed.confirmed).toBe(true);

      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      bookingConfirmed.createdAt = oneHourAgo;
      await travelBookingRepo.save(bookingConfirmed);

      const travelOneHourAfterBooking = await travelService.findOne(
        travel.uuid,
      );
      expect(travelOneHourAfterBooking.availableSeats).toBe(2);
    });

    it('should block the confirmation after 15minutes', async () => {
      const booking = await travelService.bookingReservation({
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
      await travelBookingRepo.save(booking);

      await expect(
        travelService.bookingConfirmation({
          bookingUuid: booking.uuid,
        }),
      ).rejects.toThrowError(BookingExpiredException);
    });
  });
});
