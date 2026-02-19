"use strict";

import path from "path";
import express from "express";
import apiRequest from "./routes/api.js";
import healthCheck from "./routes/health-check.js";

const appUrl = path.join(process.cwd(), "client/dist");

const appRoutes = (app) => {
  app.all("/ngx-giza/*", apiRequest);
  app.all("/health-check", healthCheck);
  app.use(`/`, express.static(appUrl));
  app.use(`/*`, express.static(appUrl));
};

export default appRoutes;
