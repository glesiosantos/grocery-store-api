import validator from 'validator'
import { EmailValidatorAdapter } from './email_validator_adapter'

jest.mock('validator', () => ({
  isEmail(): boolean { return true }
}))

describe('Email Validator Adapter', () => {
  it('should return false when EmailValidator return false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  it('should return true when EmailValidator return true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })
})
