const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
app.listen(1000, () => {
  console.log("listening to port 1000 ...");
});
