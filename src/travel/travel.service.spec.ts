import { TravelService } from './travel.service';
import { getTestingModuleWihInMemoryDB } from '../../test/utils/get-testing-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelBooking } from './entities/travel-booking.entity';
import { travelSeeds } from '../migrations/seeds/travels';
import { NotEnoughSeatsException } from './exceptions/not-enough-seats.exception';
import { TravelNotFoundException } from './exceptions/travel-not-found.exception';

describe('travel service', () => {
  let travelService: TravelService;

  beforeEach(async () => {
    const module = await getTestingModuleWihInMemoryDB({
      imports: [TypeOrmModule.forFeature([Travel, TravelBooking])],
      providers: [TravelService],
    });

    travelService = module.get<TravelService>(TravelService);
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
  });
});
