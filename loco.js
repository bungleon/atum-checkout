"use strict";
import fetch from "node-fetch";
import fs from "fs";

class HTTPResponseError extends Error {
  constructor(res) {
    super(
      `HTTP Error Response: ${res.status} ${res.statusText} Url=${res.url}`
    );
    this.res = res;
  }
}
class _loco {
  constructor(config = {}) {
    this.config = {
      ...{
        key: "ZRaQ4Oxg6Nzu4JfPMKBPDqmJtNS4Ia2dK",
        locale: "en",
        fallback: "en",
        fileFormat: "utf8",
        deleteAbsent: true,
        noFolding: true,
        importUrl: "https://localise.biz/api/import/json",
        exportUrl: `https://localise.biz/api/export/all`,
      },
      ...config,
    };
  }
  _sourceFile = function () {
    return fs.readFileSync(
      `client/src/assets/i18n/${this.config.locale}.json`,
      this.config.format
    );
  };

  _fnImport = async function () {
    const _params = new URLSearchParams({
      key: this.config.key,
      locale: this.config.locale,
      "delete-absent": this.config.deleteAbsent,
      "ignore-existing": true,
    });

    const res = await fetch(`${this.config.importUrl}?${_params}`, {
      method: "POST",
      body: this._sourceFile(),
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new HTTPResponseError(res);
    }
  };

  _fnExport = async function () {
    const _params = new URLSearchParams({
      key: this.config.key,
      fallback: this.config.fallback,
      "no-folding": this.config.noFolding,
    });

    const res = await fetch(`${this.config.exportUrl}?${_params}`, {
      method: "GET",
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new HTTPResponseError(res);
    }
  };

  import = function () {
    return new Promise((resolve, reject) => {
      this._fnImport()
        .then((res) => {
          console.log(`Loco imports => ${res.status} ${res.message}`);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  export = function () {
    this._fnExport()
      .then((res) => {
        console.log(
          `Loco exports => ${Object.keys(res).length} locales to project`
        );
        Object.keys(res).forEach((key) => {
          const locale = key.toLowerCase().substring(0, 2);
          console.log(`Exporting ${locale}.json`);
          fs.writeFileSync(
            `client/src/assets/i18n/${locale}.json`,
            JSON.stringify(res[key], null, 2)
          );
        });
      })
      .catch((err) => console.log(err));
  };
}

const locolise = new _loco();
//locolise.export();
locolise.import().then(() => locolise.export());
