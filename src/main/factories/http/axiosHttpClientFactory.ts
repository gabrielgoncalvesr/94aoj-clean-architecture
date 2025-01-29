import { AxiosHttpClient } from '../../../infra/axiosHttpClient/axiosHttpClient'
import { AuthenticationModel } from '../../../data/services/authentication'

export const MakeAxiosHttpClient = (): AxiosHttpClient<any, AuthenticationModel> => {
  return new AxiosHttpClient()
}
