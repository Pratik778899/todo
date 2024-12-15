const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");
const bodyParser = require("body-parser");

const loginRoutes = require("./routes/loginRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api", loginRoutes);
app.use("/api", todoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
