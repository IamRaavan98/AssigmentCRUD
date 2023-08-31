require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const path = require('path');

// middleware
app.use(express.json());

// app.use(cors());

// app.get("/", (req, res) => {
//   res.status(400).send("Welcome to Backend");
// });

// middleware
app.use(cookieParser());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.use("/api/users", userRoutes);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running", process.env.PORT || 4000);
});
