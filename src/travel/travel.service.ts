import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { TravelBooking } from './booking/enitities/travel-booking.entity';

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

  findOneByUuid(uuid: string) {
    return this.travelRepository.findOne({
      where: {
        uuid,
      },
    });
  }

  findOneBySlug(slug: string) {
    return this.travelRepository.findOne({
      where: {
        slug,
      },
    });
  }
}
