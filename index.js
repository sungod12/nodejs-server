const express = require("express");
const cors=require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT=3001;
const { encrypt, decrypt } = require("./EncryptionHandler");
const {database} = require("./fire");



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
    .catch((err) => {console.log(err.message)});
  db.off();
});

app.get("/showPasswords/:id",async(req,res)=>{
  id=req.params['id'];
  const db = database.ref(`${id}`);
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
  const db = database.ref(`${id}/${req.body.id}`);
  db.remove();
  db.off();
})

app.post("/decryptPassword",(req,res)=>{
  res.send(decrypt(req.body));
})

app.listen(process.env.PORT || PORT,()=>console.log("server is running"));