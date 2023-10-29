import { AccountModel } from '../../models/account'

export interface LoadAccountByEmail {
  loadByEmail(email: string): Promise<AccountModel | null>
}
