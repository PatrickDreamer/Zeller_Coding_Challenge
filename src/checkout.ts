import { Product, PricingRule, CartItem } from './types';

class Checkout {
  private cart: Map<string, CartItem> = new Map();
  private pricingRules: PricingRule[];
  private products: Product[];

  constructor(pricingRules: PricingRule[], products: Product[]) {
    this.pricingRules = pricingRules;
    this.products = products;
  }

  scan(sku: string): void {
    const product = this.products.find((p) => p.sku === sku);
    if (!product) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    const existingItem = this.cart.get(sku);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.set(sku, { product, quantity: 1 });
    }
  }

  total(): number {
    let total = 0;

    for (const [sku, item] of this.cart.entries()) {
      const rule = this.pricingRules.find((r) => r.sku === sku);

      if (rule) {
        total += this.applyPricingRule(item, rule);
      } else {
        total += item.product.price * item.quantity;
      }
    }

    return Math.round(total * 100) / 100;
  }

  private applyPricingRule(item: CartItem, rule: PricingRule): number {
    switch (rule.type) {
      case 'x_for_y':
        return this.calculateXForY(item, rule.config.x!, rule.config.y!);

      case 'bulk_discount':
        return this.calculateBulkDiscount(
          item,
          rule.config.threshold!,
          rule.config.discountedPrice!
        );

      case 'fixed_price':
        return rule.config.discountedPrice! * item.quantity;

      default:
        return item.product.price * item.quantity;
    }
  }

  private calculateXForY(item: CartItem, x: number, y: number): number {
    const sets = Math.floor(item.quantity / x);
    const remainder = item.quantity % x;

    return sets * y * item.product.price + remainder * item.product.price;
  }

  private calculateBulkDiscount(
    item: CartItem,
    threshold: number,
    discountedPrice: number
  ): number {
    if (item.quantity > threshold) {
      return item.quantity * discountedPrice;
    }
    return item.quantity * item.product.price;
  }

  // For testing purposes
  getCart(): Map<string, CartItem> {
    return new Map(this.cart);
  }
}

export = Checkout;
