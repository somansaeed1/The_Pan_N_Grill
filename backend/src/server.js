const app = require('./app');
const db = require('./db');

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Pan N Grill API listening on port ${port}`);
});

// Create the table in the background; /api/health reports the database state meanwhile.
db.init();
