require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://yadavmohit11835_db_user:ShivParvati123@ac-kwwz6do-shard-00-00.lasufkh.mongodb.net:27017,ac-kwwz6do-shard-00-01.lasufkh.mongodb.net:27017,ac-kwwz6do-shard-00-02.lasufkh.mongodb.net:27017/notes?ssl=true&replicaSet=atlas-m7i7mh-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// MODELS
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});

const Note = mongoose.model("Note", {
  userId: String,
  title: String,
  content: String
});

// AUTH
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "mahadev123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ROUTES

app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashed
  });

  res.json({ message: "Signup Successful" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.json({ message: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "mahadev123");

  res.json({ token });
});

// ADD NOTE
app.post("/notes", auth, async (req, res) => {
  await Note.create({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content
  });

  res.json({ message: "Note Added" });
});

// GET NOTES
app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

// DELETE NOTE
app.delete("/notes/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("Server chal raha hai http://localhost:3000");
});