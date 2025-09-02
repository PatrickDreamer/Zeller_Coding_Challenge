export interface Product {
  sku: string;
  name: string;
  price: number;
}

export interface PricingRule {
  type: 'bulk_discount' | 'x_for_y' | 'fixed_price';
  sku: string;
  config: {
    threshold?: number;
    discountedPrice?: number;
    x?: number;
    y?: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
