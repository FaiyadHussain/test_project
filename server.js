const express = require("express");

const app = express();
require("dotenv").config();
const authroutes = require("./routes/authroutes");

app.use(express.json());

const mongoose = require("mongoose");

// Connect to MongoDB using the correct environment variable name
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use("/api/auth", authroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
