import { HttpClient } from '../protocols/http/httpClient'
import { HttpStatusCode } from '../protocols/http/httpStatusCode'

export interface AuthenticationParams {
  login: string
  password: string
}

export interface AuthenticationModel {
  userName: string
  email: string
  token: string
}

export class AuthenticationService {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<AuthenticationModel>
  ) {}

  async auth(params: AuthenticationParams): Promise<AuthenticationModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.Ok:
        return httpResponse.body

      case HttpStatusCode.NotFound:
        throw new Error('Usuário não encontrado')

      default:
        throw new Error('Erro ao realizar login')
    }
  }
}
