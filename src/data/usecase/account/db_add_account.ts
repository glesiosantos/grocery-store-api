import { AccountModel } from '../../../domains/models/account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccountRepository } from '../../protocols/add_account_repository'
import { AddAccount, AddAccountModel } from '../../../domains/usecase/account/add_account'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) { }
  async add(data: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    const account = await this.addAccountRepository.add(Object.assign({}, data, { password: hashedPassword }))
    return account
  }
}
