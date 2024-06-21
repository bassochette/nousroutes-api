export class BookingNotFoundException extends Error {
  constructor(bookingUuid: string) {
    super(`booking ${bookingUuid} not found`);
  }
}
