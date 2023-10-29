import { EmailValidator } from '../../validations/validator/email_validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false
  }
}
