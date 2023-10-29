import { EmailValidator } from '../../validations/validator/email_validator'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers/http/http_helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return { statusCode: 200, body: null }
  }
}
