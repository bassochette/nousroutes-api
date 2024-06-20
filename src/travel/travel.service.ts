import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
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
}
