import { LoadAccountByEmail } from '../../../domains/usecase/account/load_account_by_email'
import { badRequest, serverError } from '../../helpers/http/http_helpers'
import { AddAccount, Controller, DuplicatedParamError, EmailValidator, HttpRequest, HttpResponse, InvalidParamError, MissingParamError } from './sign_up_protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly loadAccountByEmail: LoadAccountByEmail,
    private readonly addAccount: AddAccount) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const existAccount = await this.loadAccountByEmail.loadByEmail(email)

      if (existAccount) {
        return badRequest(new DuplicatedParamError('email', email))
      }

      const account = await this.addAccount.add({ name, email, password })

      return { statusCode: 200, body: account }
    } catch (error) {
      return serverError()
    }
  }
}
