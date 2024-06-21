export class TravelNotFoundException extends Error {
  constructor(uuid: string) {
    super(`travel with uuid ${uuid} not found`);
  }
}
