import { ProductsService } from '../../../data/services/products'
import { MakeAxiosHttpClient } from '../http/axiosHttpClientFactory'

export const MakeProducts = (): ProductsService => {
  return new ProductsService(
    'https://burgerlivery-api.vercel.app',
    MakeAxiosHttpClient()
  )
}
