import bcrypt from 'bcrypt'
import { BCryptAdapater } from './bcrypt_adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> { return new Promise(resolve => { resolve('any_hash') }) }
}))

const salt: number = 12

describe('BCrypter Adapter', () => {
  it('should calls BCrypt with correct values', async () => {
    const sut = new BCryptAdapater(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return hash on success', async () => {
    const sut = new BCryptAdapater(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('any_hash')
  })
})
