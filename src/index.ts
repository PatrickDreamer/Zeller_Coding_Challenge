import Checkout from './checkout';
import defaultPricingRules from './pricingRules';
import { defaultProducts } from './products';

function demonstrateExamples() {
  console.log('=== Example Scenario 1 ===');
  const co1 = new Checkout(defaultPricingRules, defaultProducts);
  co1.scan('atv');
  co1.scan('atv');
  co1.scan('atv');
  co1.scan('vga');
  console.log('SKUs: atv, atv, atv, vga');
  console.log('Total expected: $249.00');
  console.log('Total actual: $' + co1.total().toFixed(2));
  console.log();

  console.log('=== Example Scenario 2 ===');
  const co2 = new Checkout(defaultPricingRules, defaultProducts);
  const items2 = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd'];
  items2.forEach((item) => co2.scan(item));
  console.log('SKUs: atv, ipd, ipd, atv, ipd, ipd, ipd');
  console.log('Total expected: $2718.95');
  console.log('Total actual: $' + co2.total().toFixed(2));
}

demonstrateExamples();
