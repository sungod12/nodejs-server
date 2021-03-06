const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const PORT = 3001;
const { encrypt, decrypt } = require("./EncryptionHandler");
const { database, auth } = require("./fire");
app.use(cors());
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  next();
};

app.get("/", (req, res) => {
  res.json("Welcome to server");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      res.json({ message: "success" });
    })
    .catch(() => {
      res.json({ error: "Error!Account already Exists" });
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

app.post("/resetPassword", (req, res) => {
  const { email } = req.body;
  auth
    .sendPasswordResetEmail(email)
    .then(() => res.json({ message: "Success" }))
    .catch((err) => res.json(err));
});

app.post("/logout", (req, res) => {
  auth.signOut().then(() => res.json({ message: "Success" }));
});

app.post("/addPassword", verify, (req, res) => {
  const db = database.ref(`${req.body.id}`);
  const { title, password } = req.body;
  try {
    const hashedPassword = encrypt(password);
    const details = {
      title: title,
      password: hashedPassword,
    };
    db.push(details);
    res.json({ message: "successfully inserted" });
  } catch (err) {
    res.json({ message: "Some error occured" });
  } finally {
    db.off();
  }
});

app.get("/showPasswords/:id", verify, async (req, res) => {
  id = req.params["id"];
  const db = database.ref(`${id}`);
  const data = await db.get();
  const value = data.val();
  const result = [];
  for (let id in value) {
    result.push({ id, ...value[id] });
  }
  res.json({ result });
  db.off();
});

app.post("/deletePassword/:id", (req, res) => {
  id = req.params["id"];
  const db = database.ref(`${id}/${req.body.id}`);
  res.json({ message: "successfully deleted" });
  db.remove();
  db.off();
});

app.post("/decryptPassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(process.env.PORT || PORT, () => console.log("server is running"));
