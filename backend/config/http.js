module.exports.http = {
  middleware: {
    order: [
      "cookieParser",
      "bodyParser",
      "customCors",
      "fileMiddleware",
      "compress",
      "poweredBy",
      "router",
      "www",
      "favicon",
    ],
    bodyParser: (function () {
      const bodyParser = require("body-parser");
      const jsonParser = bodyParser.json();
      const urlencodedParser = bodyParser.urlencoded({ extended: true });
      return [jsonParser, urlencodedParser];
    })(),
    fileMiddleware: (function () {
      const multer = require("multer");
      const upload = multer();
      return upload.any();
    })(),
    customCors: (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, HEAD"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "content-type, Authorization, X-Requested-With"
      );
      res.header("Access-Control-Allow-Credentials", true);
      next();
    },
  },
};
