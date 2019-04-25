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

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/matches", (request, response) => {
  // http.get(
  //   "http://cricapi.com/api/matches?apikey=ceTb1jjmV4PZCnj6TBjkuOgu26W2",
  //   recData => {
  //     console.log(recData);
  //     res.redirect("/");
  //   }
  // );
  http
    .get(
      "http://cricapi.com/api/matches?apikey=ceTb1jjmV4PZCnj6TBjkuOgu26W2",
      res => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            // console.log(parsedData);
            response.render("showMatch", { matches: parsedData.matches });
          } catch (e) {
            console.error(e.message);
            response.send(e.message);
          }
        });
      }
    )
    .on("error", e => {
      console.error(`Got error: ${e.message}`);
      response.send(e.message);
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
