/* ----------------------------------- */
/* Module dependencies and env setup */
/* ----------------------------------- */
require("dotenv").config();
const path = require("path");
var bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const multer = require("multer");
const fileupload = require("express-fileupload");
var cors = require("cors");
// const { listCollectionMints } = require('./collection-list-eth')
// const { mintCollectionMint } = require('./collection-mint-eth')

// const swaggerUi = require("swagger-ui-express");

const database = require("./services/database");
// const cronJobs = require("./services/cronJobs");

/* ----------------------------------- */
/* Initializing Express App */
/* ----------------------------------- */
const app = express();
const isDev = process.env.NODE_ENV === "development";

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.enable("etag");
app.disable("x-powered-by");
app.set("json spaces", isDev ? 2 : 0);

/* ----------------------------------- */
/* Initiating Database connection */
/* ----------------------------------- */
database.connect();
// cronJobs.init();
// listCollectionMints()
// mintCollectionMint()
/* ----------------------------------- */
/* Registering required middlewares */
/* ----------------------------------- */

// Request/Response patchers / Functionality enhancers
// app.use(require("./middlewares/sentry-request-handler"));
// app.use(require("./middlewares/compression"));
// app.use(require('./middlewares/cookie-parser'));
// app.use(require("./middlewares/payhook-parser"));
// app.use(require("./middlewares/body-parser"));

// Security related middlewares
app.use(helmet());
app.use(cors());

// app.use(require("./middlewares/nocache"));
// app.use(require("./middlewares/cors-handler"));

// Host Auth
// app.use(require("./middlewares/hostAuth"));

app.use(fileupload());
app.use(express.static("files"));

// TODO: Enable CSRF handling
// app.use(require('./middlewares/csrf-handler'));
// app.use(require('../../../middlewares/csp-handler'));

// Client related middlewares
// app.use(require("./middlewares/favicon"));
// app.use(require("./middlewares/robots"));

// Server/API related middlewares
// app.use(require("./middlewares/api-headers"));
// app.use(require("./middlewares/ip-handler"));
// app.use(require("./middlewares/access-log"));

// Server Size Limit
// app.use(bodyParser({ limit: "150mb" }));

// Server/API binding routes
// app.use('/files', express.static(path.join(__dirname, 'files')))
app.use("/images", express.static(path.join(__dirname, "/public/images")));
// app.use("/static", express.static(path.join(__dirname, "static")));
// app.use(express.static(__dirname + "/public"));
app.use("/", /* require('./middlewares/valid-referer'), */ require("./routes"));

// Error handling related middlewares
// app.use(require('./middlewares/err-handler-sentry'));
// app.use(require('./middlewares/err-handler-404'));
// app.use(require('./middlewares/err-handler-log'));
// app.use(require('./middlewares/err-handler-response'));

/* ----------------------------------- */
/* Initialising server on given port */
/* ----------------------------------- */

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log("Server is running on port:" + port);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
  // }
  // {
  // cors: {
  //   origin: process.env.REACT_APP_URL,
  //   // credentials: true,
  // },
});

module.exports = { app };
