export interface BaseProduct {
  id: number
  image: string | string[]
  title: string
  description: string
}

export interface SimpleProduct extends BaseProduct {
  value: number
}

export interface ProductWithSizes extends BaseProduct {
  values: {
    small: number | null
    large: number | null
  }
}

export interface BurgerProduct extends BaseProduct {
  values: {
    single: number
    combo: number
  }
}

export type Product = SimpleProduct | ProductWithSizes | BurgerProduct
