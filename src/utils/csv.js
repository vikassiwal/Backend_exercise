const fs = require('fs');
const { parse } = require('csv-parse');

// Required fields for product
const REQUIRED_FIELDS = ['sku', 'name', 'brand', 'mrp', 'price'];

function validateRow(row) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || String(row[field]).trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }
  if (row.mrp !== undefined) {
    const mrpNum = Number(row.mrp);
    if (Number.isNaN(mrpNum) || mrpNum < 0) {
      errors.push('mrp must be a non-negative number');
    }
  }
  if (row.price !== undefined) {
    const priceNum = Number(row.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      errors.push('price must be a non-negative number');
    }
  }
  if (row.quantity !== undefined && row.quantity !== '') {
    const qtyNum = Number(row.quantity);
    if (!Number.isInteger(qtyNum) || qtyNum < 0) {
      errors.push('quantity must be an integer >= 0');
    }
  }
  const mrpVal = Number(row.mrp);
  const priceVal = Number(row.price);
  if (!Number.isNaN(mrpVal) && !Number.isNaN(priceVal) && priceVal > mrpVal) {
    errors.push('price must be ≤ mrp');
  }

  return { valid: errors.length === 0, errors };
}

async function parseCsvFile(filePath) {
  const records = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row) => {
        records.push(row);
      })
      .on('error', (err) => reject(err))
      .on('end', () => resolve(records));
  });
}

function normalizeRow(row) {
  return {
    sku: String(row.sku).trim(),
    name: String(row.name).trim(),
    brand: String(row.brand).trim(),
    color: row.color ? String(row.color).trim() : null,
    size: row.size ? String(row.size).trim() : null,
    mrp: Number(row.mrp),
    price: Number(row.price),
    quantity: row.quantity === undefined || row.quantity === '' ? 0 : Number(row.quantity),
  };
}

module.exports = {
  parseCsvFile,
  validateRow,
  normalizeRow,
  REQUIRED_FIELDS,
};
