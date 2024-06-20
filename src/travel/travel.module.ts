import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelBooking } from './entities/travel-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, TravelBooking])],
  providers: [TravelResolver, TravelService],
})
export class TravelModule {}
