const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(
  "/locations",
  (req, res, next) => {
    console.log("Incoming request URL:", req.url);
    console.log(
      "Target URL:",
      `http://inblrwfd10nz3.vcn.ds.volvo.net:5100/location/`
    );
    next();
  },
  createProxyMiddleware({
    target: "http://inblrwfd10nz3.vcn.ds.volvo.net:5100/locations",
    changeOrigin: true,
  })
);

app.use(
  "/location/:location",
  (req, res, next) => {
    console.log("request param location", req.params.location);
    next();
  },
  createProxyMiddleware({
    router: (req) => {
      const location = req.params.location;
      return `http://inblrwfd10nz3.vcn.ds.volvo.net:5100/location/${location}`;
    },
    changeOrigin: true,
  })
);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
