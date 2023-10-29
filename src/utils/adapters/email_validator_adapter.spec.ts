import validator from 'validator'
import { EmailValidatorAdapter } from './email_validator_adapter'
import { EmailValidator } from '../../validations/validator/email_validator'

jest.mock('validator', () => ({
  isEmail(): boolean { return true }
}))

const makeSut = (): EmailValidator => new EmailValidatorAdapter()

describe('Email Validator Adapter', () => {
  it('should return false when EmailValidator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  it('should return true when EmailValidator return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })

  it('should calls Validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
