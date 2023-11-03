import { AccountModel } from '../../../domains/models/account'
import { AddAccountModel } from '../../../domains/usecase/account/add_account'

export interface AddAccountRepository {
  add(data: AddAccountModel): Promise<AccountModel | null>
}
