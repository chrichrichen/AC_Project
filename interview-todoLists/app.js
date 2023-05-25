const express = require('express');
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const routes = require('./routes');

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});