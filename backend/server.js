const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/database");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

connectDatabase();
app.listen(8000, () => {
  console.log(
    `server listen to the port:${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
