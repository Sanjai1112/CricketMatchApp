const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
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
        const { statusCode } = res;
        const contentType = res.headers["content-type"];
        let error;
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            "Invalid content-type.\n" +
              `Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          return;
        }

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
