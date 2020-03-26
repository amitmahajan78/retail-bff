const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const cron = require("node-cron");
require("dotenv").config();
// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

const receiveShipment = require("./tasks/consumer");

// app
const app = express();

// db
mongoose
    .connect(process.env.MONGODB_HOST + "/retaildb?retryWrites=true", {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB Connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;
const db_hostname = process.env.MONGODB_HOST;
const kafka_hostname = process.env.KAFKA_ZOOKEEPER_CONNECT;

app.listen(port, () => {
    console.log(`DB Hostname ${db_hostname}`);
    console.log(`Kafka Hostname ${kafka_hostname}`);
    console.log(`Server is running on port ${port}`);
});
