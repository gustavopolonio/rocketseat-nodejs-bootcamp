export class ExpiredCheckInValidationError extends Error {
  constructor() {
    super('Expired check-in validation')
  }
}
