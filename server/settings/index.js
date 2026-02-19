"use strict";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const middlewares = (app) => {
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ type: "application/json", limit: "15mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));

  // csrf setup
  // app.use(cookieParser("ucg83gf696rgsuc"));
  // app.use(
  //   csrf({
  //     cookie: {
  //       httpOnly: true,
  //     },
  //   })
  // );
  // app.use(function (req, res, next) {
  //   res.cookie("XSRF-TOKEN", req.csrfToken());
  //   next();
  // });
  // app.use(function (err, req, res, next) {
  //   if (err.code !== "EBADCSRFTOKEN") {
  //     return next(err);
  //   }
  //   res.status(500);
  //   res.json({ code: "83402", message: "Please refresh your page." });
  // });
};

export default middlewares;
