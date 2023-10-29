import validator from 'validator'
import { EmailValidator } from '../../validations/validator/email_validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
