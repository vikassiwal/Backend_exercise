const path = require('path');
const Database = require('better-sqlite3');
let dbInstance = null;

function getDatabaseFile() {
  if (process.env.NODE_ENV === 'test') {
    return ':memory:';
  }
  const fileFromEnv = process.env.DATABASE_FILE;
  if (fileFromEnv) return fileFromEnv;
  return path.join(__dirname, '..', 'data', 'products.sqlite');
}

function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(getDatabaseFile());
    // Ensure foreign keys/PRAGMAs as needed
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('synchronous = NORMAL');
  }
  return dbInstance;
}

function initializeDatabase() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      color TEXT,
      size TEXT,
      mrp REAL NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
  `);
}

module.exports = { getDb, initializeDatabase };
