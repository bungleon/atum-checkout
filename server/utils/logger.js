import morgan from "morgan";
import chalk from "chalk";

const fields = [
  "username",
  "user_name",
  "userName",
  "password",
  "token",
  "secret",
  "cvv",
  "expiry_month",
  "expirymonth",
  "expiryMonth",
  "expiry_year",
  "expiryYear",
  "expiryyear",
  "email",
  "cardNumber",
  "card_number",
  "cardnumber",
  "bank_account_detail",
  "iban",
  "api_key",
  "apikey",
  "apiKey",
  "secret_key",
  "secretkey",
  "secretKey",
  "number",
  "otp",
  "role",
];

function skipThis(req, _) {
  if (
    !req.originalUrl.includes("/ngx-giza/") &&
    !req.originalUrl.includes("/e-handler")
  ) {
    return true;
  }
  return false;
}

function mask(params) {
  fields.forEach((field) => {
    if (params[field]) {
      params[field] = `${field}-***`;
    }
  });
  return params;
}

morgan.token("date", function () {
  return `${new Date().toISOString()}`;
});

morgan.token("maskBody", function (req, res) {
  const body = mask(req.body);
  return JSON.stringify(body);
});

morgan.token("maskUrl", (req) => {
  const url = new URL(req.originalUrl, `https://${req.headers.host}`);
  const params = mask(url.searchParams);
  return url.pathname + params.toString();
});

morgan.format("logFormat", (token, req, res) => {
  const format = [
    chalk.hex("#ffffff")(`🏁`),
    chalk.hex("#f40a0a")(token.method(req, res)),
    chalk.hex("#ffffff")(token.status(req, res)),
    chalk.hex("#1e90ff")(` ${token.maskUrl(req, res)}`),
    chalk.hex("#2ed573")(token["response-time"](req, res) + "ms"),
    chalk.hex("#ffffff")("@" + token.date(req, res)),
  ];
  if (req.originalUrl.includes("/e-handler")) {
    format.push(chalk.hex("#ffffff")("Req: " + token.maskBody(req, res)));
  }
  return format.join(" ");
});

const logger = morgan("logFormat", {
  skip: skipThis,
});

export default logger;
