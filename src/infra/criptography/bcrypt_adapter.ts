import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'

export class BCryptAdapater implements Encrypter {
  constructor(private readonly salt: number = 12) { }
  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return new Promise(resolve => { resolve('') })
  }
}
