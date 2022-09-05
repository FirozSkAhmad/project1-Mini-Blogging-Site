const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const route = require("./router/router");
const { default: mongoose } = require("mongoose");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/", route);

mongoose
  .connect(
    "mongodb+srv://Firoz_Shaik_:XaFPzUPEGu5fK1KS@cluster0.dshhzz6.mongodb.net/Firoz_Shaik-project1-DB",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is Connted"))
  .catch((err) => console.log(err));

app.listen(3000, function () {
  console.log("Express is connected in port:" + 3000);
});
