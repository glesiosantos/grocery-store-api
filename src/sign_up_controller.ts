export class SignUpController {
  async handle(httpRequest: any): Promise<any> {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredField) {
      if (!httpRequest.body[field]) {
        return { statusCode: 400, body: new Error(`Missing param: ${field}`) }
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return { statusCode: 400, body: new Error('Invalid param: passwordConfirmation') }
    }
  }
}
