import { AccountModel } from '../../../domains/models/account'
import { badRequest, serverError } from '../../helpers/http/http_helpers'
import { SignUpController } from './sign_up_controller'
import { AddAccount, AddAccountModel, Controller, EmailValidator, HttpRequest, InvalidParamError, MissingParamError } from './sign_up_protocols'

type SutTypes = {
  sut: Controller
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(data: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => {
        resolve({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'hashed_password',
          createdAt: new Date('2019-10-01T00:00:01.30Z')
        })
      })
    }
  }

  return new AddAccountStub()
}

const makeFakeAccountRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('Sign Up Controller', () => {
  it('should return 400 when name is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAccountRequest()
    delete httpRequest.body.name
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('name')))
  })

  it('should return 400 when email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAccountRequest()
    delete httpRequest.body.email
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 when password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAccountRequest()
    delete httpRequest.body.password
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return 400 when password confirmation is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAccountRequest()
    delete httpRequest.body.passwordConfirmation // remove o atributo password confirmation
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('should return 400 when password confirmation is fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeAccountRequest()
    httpRequest.body.passwordConfirmation = 'invalid_password'
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should calls EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeAccountRequest())
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })

  it('should return 400 when EmailValidator return false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const response = await sut.handle(makeFakeAccountRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 500 when EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(makeFakeAccountRequest())
    expect(response).toEqual(serverError())
  })

  it('should calls AddAccount wiht correct values ', async () => {
    const { sut, addAccountStub } = makeSut()
    const addStub = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeAccountRequest())
    expect(addStub).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 when AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const addStub = jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    await sut.handle(makeFakeAccountRequest())
    expect(addStub).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  it('should return 200 when valid data is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeAccountRequest())
    expect(response).toEqual({
      statusCode: 200,
      body: {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
        createdAt: new Date('2019-10-01T00:00:01.30Z')
      }
    })
  })
})