import { TravelService } from './travel.service';
import { getTestingModuleWihInMemoryDB } from '../../test/utils/get-testing-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelBooking } from './entities/travel-booking.entity';
import { travelSeeds } from '../migrations/seeds/travels';

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
});
