import { AccountModel } from '../../../domains/models/account'
import { AddAccount, AddAccountModel } from '../../../domains/usecase/account/add_account'
import { AddAccountRepository } from '../protocols/add_account_repository'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db_add_account'

const makeAccountDataFake = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeAccountDbFake = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  createdAt: new Date('2019-10-01T00:00:01.30Z')
})

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(data: AccountModel): Promise<AccountModel> {
      return new Promise(resolve => { resolve(makeAccountDbFake()) })
    }
  }

  return new AddAccountRepositoryStub()
}

type SutType = {
  sut: AddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DB Add Account usecase', () => {
  it('should calls Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeAccountDataFake())
    expect(encrypterSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throws when Ecnrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeAccountDataFake())
    await expect(promise).rejects.toThrow()
  })

  it('should calls AddAccountRepository with corrects values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeAccountDataFake())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throws when AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeAccountDataFake())
    await expect(promise).rejects.toThrow()
  })

  it('should an account on successed', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountDataFake())
    expect(account).toEqual(makeAccountDbFake())
  })
})
