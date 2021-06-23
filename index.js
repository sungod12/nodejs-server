const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3001;
const { encrypt, decrypt } = require("./EncryptionHandler");
const { database, auth } = require("./fire");

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      res.send("success");
    })
    .catch(() => {
      res.send("Error!Account already Exists");
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

app.post("/resetPassword", (req, res) => {
  const { email } = req.body;
  auth
    .sendPasswordResetEmail(email)
    .then(() => res.send("Success"))
    .catch((err) => res.send(err));
});

app.post("/logout", (req, res) => {
  auth.signOut().then(() => res.send("Success"));
});

app.post("/addPassword", (req, res) => {
  const db = database.ref(`${req.body.id}`);
  const { title, password } = req.body;
  const hashedPassword = encrypt(password);
  const details = {
    title: title,
    password: hashedPassword,
  };
  db.push(details)
    .then(() => console.log("successfully inserted"))
    .catch((err) => {
      console.log(err.message);
    });
  db.off();
});

app.get("/showPasswords/:id", async (req, res) => {
  id = req.params["id"];
  const db = database.ref(`${id}`);
  const data = await db.get();
  const value = data.val();
  const temp = [];
  for (let id in value) {
    temp.push({ id, ...value[id] });
  }
  db.off();
  res.send(temp);
});

app.post("/deletePassword/:id", (req, res) => {
  id = req.params["id"];
  const db = database.ref(`${id}/${req.body.id}`);
  db.remove();
  db.off();
});

app.post("/decryptPassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(process.env.PORT || PORT, () => console.log("server is running"));
