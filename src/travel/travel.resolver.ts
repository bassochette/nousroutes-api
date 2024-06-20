import { Args, Query, Resolver } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';

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

  // TODO mutation book reservation

  // TODO mutation book confirmation
}
