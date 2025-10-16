## Product Catalog Management API (Express + SQLite)

Simple Product Catalog backend using Express.js and SQLite.

### Tech Stack
- **Backend**: Express.js
- **Database**: SQLite (better-sqlite3)

### Project Structure
```
src/
  controllers/
    productController.js
  middleware/
    upload.js
  models/
    productModel.js
  routes/
    productRoutes.js
  utils/
    csv.js
  app.js
  server.js
data/
uploads/
sample-products.csv
```

### Setup
1. Install Node.js 18+
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Server runs on `http://localhost:3000`

### Database
- SQLite file stored at `data/products.sqlite` (auto-created)
- Schema `products` with fields: `id, sku, name, brand, color, size, mrp, price, quantity, created_at`

### API Endpoints

- POST `/upload`
  - Content-Type: `multipart/form-data`
  - Field: `file` (CSV)
  - CSV columns: `sku,name,brand,color,size,mrp,price,quantity`
  - Validation:
    - Required: `sku,name,brand,mrp,price`
    - `price ≤ mrp`
    - `quantity ≥ 0` (defaults to 0 if empty)
  - Response:
    ```json
    {
      "storedCount": 20,
      "failedCount": 0,
      "stored": [{"index": 0, "sku": "SKU001"}],
      "failed": [{"index": 1, "row": {"sku": "..."}, "errors": ["..."]}]
    }
    ```

- GET `/products`
  - Query: `page` (default 1), `limit` (default 10)
  - Returns: `{ rows, total, page, limit }`

- GET `/products/search`
  - Query filters: `brand`, `color`, `minPrice`, `maxPrice`, `page`, `limit`
  - Returns: `{ rows, total, page, limit }`

### Manual Testing

1. Upload CSV
   ```bash
   curl -X POST http://localhost:3000/upload \
     -F "file=@sample-products.csv"
   ```

2. List Products (first page, 10 per page)
   ```bash
   curl "http://localhost:3000/products?page=1&limit=10"
   ```

3. Search Products
   ```bash
   curl "http://localhost:3000/products/search?brand=Acme&color=Red&minPrice=500&maxPrice=1000"
   ```

### Notes
- If a row fails DB constraints (e.g., duplicate `sku`), it appears in `failed`.
- This project keeps scope minimal per requirements.



Running Unit Tests
```bash
    "npm test"
   ```


Docker Setup

```bash
# Build Docker image
"docker build -t product-catalog-api ."

# Run Docker container
"docker run -p 3000:3000 product-catalog-" ```
-API testing (curl/Postman) Docker container ke saath bilkul pehle jaise hi hai.
-Agar database ko host machine par persist rakhna hai (optional for advanced -usage):

```bash
"docker run -p 3000:3000 -v $(pwd)/data:/app/data product-catalog-api"