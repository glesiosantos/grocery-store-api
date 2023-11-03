import { AccountModel } from '../../../domains/models/account'
import { AddAccount, AddAccountModel } from '../../../domains/usecase/account/add_account'
import { Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) { }
  async add(data: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(data.password)
    return null
  }
}
