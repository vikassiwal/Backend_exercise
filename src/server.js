const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Product Catalog API listening on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Product Catalog Backend is running.');
});
