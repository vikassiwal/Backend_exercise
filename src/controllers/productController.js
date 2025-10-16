const fs = require('fs');
const { parseCsvFile, validateRow, normalizeRow } = require('../utils/csv');
const { insertProduct, listProducts, searchProducts } = require('../models/productModel');

async function uploadProducts(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required under field name "file"' });
    }

    const filePath = req.file.path;
    const rawRows = await parseCsvFile(filePath);

    const stored = [];
    const failed = [];

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const { valid, errors } = validateRow(row);
      if (!valid) {
        failed.push({ index: i, row, errors });
        continue;
      }
      const normalized = normalizeRow(row);
      try {
        insertProduct(normalized);
        stored.push({ index: i, sku: normalized.sku });
      } catch (e) {
        // Unique constraint or other DB error
        const message = e && e.message ? e.message : 'DB error';
        failed.push({ index: i, row, errors: [message] });
      }
    }

    // Clean up uploaded file after processing
    try { fs.unlinkSync(filePath); } catch (_) {}

    return res.json({ storedCount: stored.length, failedCount: failed.length, stored, failed });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process CSV upload', details: err.message });
  }
}

function getProducts(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const result = listProducts({ page: Number(page), limit: Number(limit) });
  return res.json(result);
}

function searchProductsHandler(req, res) {
  const { brand, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  const result = searchProducts({ brand, color, minPrice, maxPrice, page: Number(page), limit: Number(limit) });
  return res.json(result);
}

module.exports = {
  uploadProducts,
  getProducts,
  searchProducts: searchProductsHandler,
};
