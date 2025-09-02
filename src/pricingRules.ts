import { PricingRule } from './types';

const defaultPricingRules: PricingRule[] = [
  {
    type: 'x_for_y',
    sku: 'atv',
    config: { x: 3, y: 2 },
  },
  {
    type: 'bulk_discount',
    sku: 'ipd',
    config: { threshold: 4, discountedPrice: 499.99 },
  },
];

export = defaultPricingRules;
