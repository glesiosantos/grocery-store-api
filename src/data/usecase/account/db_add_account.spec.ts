import { AddAccount } from '../../../domains/usecase/account/add_account'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db_add_account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncrypterStub()
}

type SutType = {
  sut: AddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return { sut, encrypterStub }
}

describe('DB Add Account usecase', () => {
  it('should calls Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountDataFake = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    await sut.add(accountDataFake)
    expect(encrypterSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throws when Ecnrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const accountDataFake = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    const promise = sut.add(accountDataFake)
    await expect(promise).rejects.toThrow()
  })
})
