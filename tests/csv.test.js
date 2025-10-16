const { validateRow } = require('../src/utils/csv');

describe('CSV Row Validation', () => {
  test('valid row passes', () => {
    const row = { 
      sku: 'SKU001', 
      name: 'Shirt', 
      brand: 'Acme', 
      mrp: 500, 
      price: 400, 
      quantity: 10 
    };
    const result = validateRow(row);
    expect(result.valid).toBe(true);
  });

  test('price > mrp fails', () => {
    const row = { 
      sku: 'SKU002', 
      name: 'Socks', 
      brand: 'Acme', 
      mrp: 200, 
      price: 300, 
      quantity: 5 
    };
    const result = validateRow(row);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('price must be ≤ mrp');
  });
});
