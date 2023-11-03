import { AccountModel } from '../../../domains/models/account'
import { AddAccount, AddAccountModel } from '../../../domains/usecase/account/add_account'
import { AddAccountRepository } from '../protocols/add_account_repository'
import { Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) { }
  async add(data: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    await this.addAccountRepository.add(Object.assign({}, data, { password: hashedPassword }))
    return null
  }
}
