const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Serividor corriendo en ${PORT}`);
});
