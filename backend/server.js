var express = require("express");
var dotenv = require("dotenv");
dotenv.config();
var cookieParser = require("cookie-parser");
var connectDb = require("./config/db");
const port = process.env.PORT || 5000;
var userRoutes = require("./routes/userRoutes");
const cors = require("cors");

connectDb();
const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
