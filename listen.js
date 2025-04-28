const app = require("./app.js")

app.listen(7070, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port 7070");
  }
});

