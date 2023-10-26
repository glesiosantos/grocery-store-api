import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers/http/http_helpers'
import { Controller } from '../protocols/controller'
import { type HttpResponse, type HttpRequest } from '../protocols/http'

export class SignUpController implements Controller {
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

    return { statusCode: 200, body: null }
  }
}
