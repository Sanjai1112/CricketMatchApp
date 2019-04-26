const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let cricapiCall = url => {
  return new Promise((resolve, reject) => {
    http
      .get(url, res => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            // console.log(parsedData);
            // console.log(new Array("success", parsedData));
            resolve(parsedData);
          } catch (e) {
            console.error(e.message);
            reject(e.message);
          }
        });
      })
      .on("error", e => {
        console.error(`Got error: ${e.message}`);
        reject(e.message);
      });
  });
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/matches", async (req, res) => {
  // http.get(
  //   "http://cricapi.com/api/matches?apikey=ceTb1jjmV4PZCnj6TBjkuOgu26W2",
  //   recData => {
  //     console.log(recData);
  //     res.redirect("/");
  //   }
  // );
  await cricapiCall(
    "http://cricapi.com/api/matches?apikey=ceTb1jjmV4PZCnj6TBjkuOgu26W2"
  )
    .then(result => {
      // console.log(result);
      res.render("showMatch", { matches: result.matches });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.get("/match/:id", (req, res) => {});
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
