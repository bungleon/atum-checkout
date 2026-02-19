import request from "request";
import xss from "xss";
const apiUrl = process.env.api || "https://sandbox-engine.gizapay.net";

const apiRequest = (req, res) => {
  const url = apiUrl + req.url.replace("ngx-giza/", "");
  const options = {
    url: url,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": req.headers["user-agent"] || req.get("User-Agent"),
    },
    body: xss(JSON.stringify(req.body)),
  };
  request(options, function (error, response, body) {
    if (!error) {
      try {
        let obj = {};
        if (body) {
          obj = JSON.parse(xss(body));
        }
        res.status(response.statusCode).json(obj);
      } catch (err) {
        console.log("ERROR");
        console.log("code:52401 Response is not json format");
        res
          .status(500)
          .json({ code: "52401", message: "Response Parse Error" });
      }
    } else {
      res.status(500).json({
        code: "52400",
        message: "There is no API connection!",
        url: url,
        error: JSON.stringify(error),
      });
    }
  });
};

export default apiRequest;
