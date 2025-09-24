const express = require('express');
const app = express();
const path = require('path');

// Fix: Correct path to model
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Only once is enough

app.get('/', (req, res) => {
  res.render("index");
});

app.get('/read', async(req, res) => {
  let users=await userModel.find();

  res.render("read", { users });
});
app.get('/delete/:id',async(req,res)=>{
  let users=await userModel.findOneAndDelete();
  res.render("read",{users});
})


app.get('/edit/:userid',async(req,res)=>{
  let user=await userModel.findOne({_id: req.params.userid});
  res.render("edit",{user});
})

app.post('/update/:userid', async (req, res) => {
  try {
    const { image, name, email } = req.body;
    await userModel.findByIdAndUpdate(req.params.userid, { image, name, email }, { new: true });
    res.redirect('/read'); // Only this is enough
  } catch (err) {
    console.log(err);
    res.send("Error updating user");
  }
});


app.post('/create', async (req, res) => {
  let { name, email, image } = req.body;
  let createdUser = await userModel.create({ name, email, image });

  // Just send back the created user (like you had)
  res.send(createdUser);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
