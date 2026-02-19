"use strict";

import path from "path";

import express from "express";
import middlewares from "./settings/index.js";
import appRoutes from "./app-routes.js";

const expressApp = express();
middlewares(expressApp);
appRoutes(expressApp);

export default expressApp;
