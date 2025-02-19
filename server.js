const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
const { readdirSync } = require("fs");
require("dotenv").config();

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE_SERVER, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(`DB CONNECTION ERR`, err));

//middlewares

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes middlewares
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
