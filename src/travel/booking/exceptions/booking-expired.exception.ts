export class BookingExpiredException extends Error {
  constructor(bookingUuid: string) {
    super(`Booking with uuid ${bookingUuid} expired`);
  }
}
