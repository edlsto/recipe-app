const express = require("express");
require("./mongoose");
const app = express();
const cors = require("cors");

const router = require("./router");

app.use(cors());
app.use(express.json());
app.use(router);

const port = 3001;

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
