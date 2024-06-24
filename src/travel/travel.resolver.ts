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

  @Query(() => Travel, { name: 'travelBySlug' })
  findOne(@Args('slug', { type: () => String }) slug: string) {
    return this.travelService.findOneBySlug(slug);
  }
}
