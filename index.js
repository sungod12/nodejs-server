const firebaseConfig = {
  apiKey: "AIzaSyDt_atiF8KQwRTZHZJcuU35MRfMa1WiE5s",
  authDomain: "pass-manager142.firebaseapp.com",
  databaseURL: "https://pass-manager142-default-rtdb.firebaseio.com",
  projectId: "pass-manager142",
  storageBucket: "pass-manager142.appspot.com",
  messagingSenderId: "748600489580",
  appId: "1:748600489580:web:0bc3f00926c2dea7fdca49",
};

const express = require("express");
const cors=require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT=3001;
const { encrypt, decrypt } = require("./EncryptionHandler");
const firebase = require("firebase");
require("firebase/database");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.post("/addPassword", (req, res) => {
  const db = firebase.database().ref(`${req.body.id}`);
  const { title, password } = req.body;
  const hashedPassword = encrypt(password);
  const details = {
    title: title,
    password: hashedPassword,
  };
  db.push(details)
    .then(() => console.log("successfully inserted"))
    .catch((err) => {console.log(err.message)});
  db.off();
});

app.get("/showPasswords/:id",async(req,res)=>{
  id=req.params['id'];
  const db = firebase.database().ref(`${id}`);
  const data=await db.get();
  const value=data.val();
  const temp=[];
  for(let id in value){
    temp.push({id,...value[id]});
  }
  db.off();
  res.send(temp);
  
})

app.post("/deletePassword/:id",(req,res)=>{
  id=req.params['id'];
  const db = firebase.database().ref(`${id}/${req.body.id}`);
  db.remove();
  db.off();
})

app.post("/decryptPassword",(req,res)=>{
  res.send(decrypt(req.body));
})

app.listen(process.env.PORT || PORT,()=>console.log("server is running"));