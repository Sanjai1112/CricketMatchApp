const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
