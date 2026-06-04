const https = require("https");
const fs = require("fs");
const app = require("./app");

//app.listen(3000, () => {
//  console.log("API running on \x1b[36mhttp://localhost:3000/\x1b[0m");
//});

const options = {
  key: fs.readFileSync("../../key.pem"),
  cert: fs.readFileSync("../../cert.pem"),
};

https.createServer(options, app).listen(3000, () => {
  console.log("API running on \x1b[36mhttps://localhost:3000/\x1b[0m");
});
