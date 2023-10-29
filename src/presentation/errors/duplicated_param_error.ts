export class DuplicatedParamError extends Error {
  constructor(paramError: string, paramValue: string) {
    super(`there is already an ${paramError} registered with the value of ${paramValue}`)
    this.name = 'DuplicatedParamError'
  }
}
