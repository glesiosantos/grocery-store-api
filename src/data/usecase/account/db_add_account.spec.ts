import { DbAddAccount } from './db_add_account'

describe('DB Add Account usecase', () => {
  it('should calls Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const encrypterStub = new EncrypterStub()

    const sut = new DbAddAccount(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountDataFake = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    await sut.add(accountDataFake)
    expect(encrypterSpy).toHaveBeenCalledWith('any_password')
  })
})
