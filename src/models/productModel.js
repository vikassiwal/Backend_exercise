const { getDb } = require('../db');

function insertProducts(products) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO products (sku, name, brand, color, size, mrp, price, quantity)
    VALUES (@sku, @name, @brand, @color, @size, @mrp, @price, @quantity)
  `);
  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });
  insertMany(products);
}

function listProducts({ page = 1, limit = 10 }) {
  const db = getDb();
  const offset = (Number(page) - 1) * Number(limit);
  const rows = db
    .prepare(
      `SELECT id, sku, name, brand, color, size, mrp, price, quantity, created_at
       FROM products
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(Number(limit), Number(offset));
  const total = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  return { rows, total, page: Number(page), limit: Number(limit) };
}

function searchProducts({ brand, color, minPrice, maxPrice, page = 1, limit = 10 }) {
  const db = getDb();
  const conditions = [];
  const params = {};

  if (brand) {
    conditions.push('brand = @brand');
    params.brand = brand;
  }
  if (color) {
    conditions.push('color = @color');
    params.color = color;
  }
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    conditions.push('price >= @minPrice');
    params.minPrice = Number(minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    conditions.push('price <= @maxPrice');
    params.maxPrice = Number(maxPrice);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(limit);

  const rows = db
    .prepare(
      `SELECT id, sku, name, brand, color, size, mrp, price, quantity, created_at
       FROM products
       ${where}
       ORDER BY created_at DESC
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: Number(limit), offset: Number(offset) });

  const total = db
    .prepare(`SELECT COUNT(*) as count FROM products ${where}`)
    .get(params).count;

  return { rows, total, page: Number(page), limit: Number(limit) };
}

module.exports = {
  insertProducts,
  listProducts,
  searchProducts,
};
