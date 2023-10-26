import { badRequest } from '../helpers/http/http_helpers'
import { type HttpResponse, type HttpRequest } from '../protocols/http'

export class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return badRequest(new Error(`Missing param: ${field}`))
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(new Error('Invalid param: passwordConfirmation'))
    }

    return { statusCode: 200, body: null }
  }
}
