import Checkout from '../checkout';
import defaultPricingRules from '../pricingRules';
import { defaultProducts } from '../products';
import { PricingRule } from '../types';

describe('Checkout System', () => {
  let checkout: Checkout;

  beforeEach(() => {
    checkout = new Checkout(defaultPricingRules, defaultProducts);
  });

  it('should calculate total without any discounts correctly', () => {
    checkout.scan('mbp');
    checkout.scan('vga');

    expect(checkout.total()).toBe(1399.99 + 30.0);
  });

  it('should apply 3-for-2 discount on Apple TVs', () => {
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('atv');

    expect(checkout.total()).toBe(219.0);
  });

  it('should apply 3-for-2 discount correctly with extra items', () => {
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('atv');

    expect(checkout.total()).toBe(328.5);
  });

  it('should apply bulk discount on iPads when buying more than 4', () => {
    for (let i = 0; i < 5; i++) {
      checkout.scan('ipd');
    }

    expect(checkout.total()).toBe(2499.95);
  });

  it('should not apply bulk discount on iPads when buying 4 or less', () => {
    for (let i = 0; i < 4; i++) {
      checkout.scan('ipd');
    }

    expect(checkout.total()).toBe(2199.96);
  });

  it('test scenario 1: atv, atv, atv, vga', () => {
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('atv');
    checkout.scan('vga');

    expect(checkout.total()).toBe(249.0);
  });

  it('test scenario 2: atv, ipd, ipd, atv, ipd, ipd, ipd', () => {
    const items = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd'];
    items.forEach((item) => checkout.scan(item));

    expect(checkout.total()).toBe(2718.95);
  });

  it('should handle mixed items with multiple discounts', () => {
    for (let i = 0; i < 3; i++) checkout.scan('atv');
    for (let i = 0; i < 5; i++) checkout.scan('ipd');
    checkout.scan('mbp');

    const expected = 2 * 109.5 + 5 * 499.99 + 1399.99;
    expect(checkout.total()).toBe(expected);
  });

  it('should throw error for unknown SKU', () => {
    expect(() => {
      checkout.scan('unknown');
    }).toThrow('Product with SKU unknown not found');
  });

  it('should handle empty cart', () => {
    expect(checkout.total()).toBe(0);
  });

  it('should be flexible with pricing rule changes', () => {
    const customRules: PricingRule[] = [
      {
        type: 'fixed_price',
        sku: 'vga',
        config: { discountedPrice: 25.0 },
      },
    ];

    const customCheckout = new Checkout(customRules, defaultProducts);
    customCheckout.scan('vga');
    customCheckout.scan('vga');

    expect(customCheckout.total()).toBe(50.0);
  });
});
