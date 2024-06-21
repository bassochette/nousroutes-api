export class NotEnoughSeatsException extends Error {
  constructor() {
    super(`Not enough seats on this travel`);
  }
}
