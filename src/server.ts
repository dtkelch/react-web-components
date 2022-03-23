import { CorsOptions } from "cors";
import express from "express";
// const expressStaticGzip = require("express-static-gzip");
const port = process.env.PORT || 3001;
const cors = require("cors");
const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // const allowedDomains = ["http://localhost:3000"];
    // if (origin === undefined || allowedDomains.indexOf(origin) !== -1) {
    callback(null, origin);
    // } else {
    //   callback(new Error(`The orgin ${origin} is not allowed by CORS`));
    // }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET", "POST", "OPTIONS"],
};
let app = express();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  express.json({
    limit: "50mb",
  }) as any
);
app.use(
  express.urlencoded({
    extended: true,
  }) as any
);
app.get("/data", async (req, res) => {
  res.status(200).end(`Hey ${req.query.name}!`);
});

app.use(express.static("./dist/"));

// Serve index.html for all unknown URLs
app.get(
  "/*",
  // Authentication.ensureAuthenticatedAndRedirect,
  function (req, res) {
    res.sendFile(process.cwd() + "/dist/index.html");
  }
);

const server = app.listen(port, () => {
  console.info("up and running on port", port);
});
