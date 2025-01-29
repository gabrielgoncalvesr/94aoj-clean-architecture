import { HttpClient } from '../protocols/http/httpClient'
import { HttpStatusCode } from '../protocols/http/httpStatusCode'
import { SimpleProduct, ProductWithSizes, BurgerProduct } from '../../domain/models/product'

export class ProductsService {
  constructor(
    private readonly baseUrl: string,
    private readonly httpClient: HttpClient<any>
  ) {}

  async getDesserts(): Promise<SimpleProduct[]> {
    const response = await this.httpClient.request({
      url: `${this.baseUrl}/desserts`,
      method: 'get'
    })

    if (response.statusCode === HttpStatusCode.Ok) {
      return response.body
    }

    throw new Error('Erro ao buscar sobremesas')
  }

  async getBeverages(): Promise<SimpleProduct[]> {
    const response = await this.httpClient.request({
      url: `${this.baseUrl}/beverages`,
      method: 'get'
    })

    if (response.statusCode === HttpStatusCode.Ok) {
      return response.body
    }

    throw new Error('Erro ao buscar bebidas')
  }

  async getAppetizers(): Promise<ProductWithSizes[]> {
    const response = await this.httpClient.request({
      url: `${this.baseUrl}/appetizers`,
      method: 'get'
    })

    if (response.statusCode === HttpStatusCode.Ok) {
      return response.body
    }

    throw new Error('Erro ao buscar acompanhamentos')
  }

  async getHamburgers(): Promise<BurgerProduct[]> {
    const response = await this.httpClient.request({
      url: `${this.baseUrl}/hamburgers`,
      method: 'get'
    })

    if (response.statusCode === HttpStatusCode.Ok) {
      return response.body
    }

    throw new Error('Erro ao buscar hambúrgueres')
  }
}
