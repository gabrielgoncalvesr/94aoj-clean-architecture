import { AuthenticationService } from '../../../data/services/authentication'
import { MakeAxiosHttpClient } from '../http/axiosHttpClientFactory'

export const MakeAuthentication = (): AuthenticationService => {
  return new AuthenticationService(
    'https://burgerlivery-api.vercel.app/user/login',
    MakeAxiosHttpClient()
  )
}
