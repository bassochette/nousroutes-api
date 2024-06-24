import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { TravelBooking } from './booking/enitities/travel-booking.entity';
import { BookingResolver } from './booking/booking.resolver';
import { BookingService } from './booking/booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, TravelBooking])],
  providers: [TravelResolver, TravelService, BookingResolver, BookingService],
})
export class TravelModule {}
