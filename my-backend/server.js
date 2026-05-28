const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/pins", require("./routes/pins"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/boards", require("./routes/boards"));
app.use("/api/users", require("./routes/users"));

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("PostgreSQL Connected & DB Synced!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to DB:", err));
