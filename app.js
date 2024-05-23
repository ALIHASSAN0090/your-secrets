//jshint esversion:6
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const bodyparser = require("body-parser");
const encrypt= require("mongoose-encryption");
const app = express();

app.set('view engine' , 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
      email : String,
      password : String
});

//Password Encryption
const secret = "ThisisourlittleSecret";
userSchema.plugin(encrypt , {secret : secret , encryptedFields : ['password']})


const user = new mongoose.model("user" , userSchema);


app.get("/" , function(req , res){
    res.render("home");
});

app.get("/login" , function(req , res){
    res.render("login");
});  

app.get("/register" , function(req , res){
    res.render("register");
}); 

app.get("/secrets" , function(req , res){
    res.render("secrets");
}); 

app.get("/submit" , function(req , res){
    res.render("submit");
}); 



//mongodb register for post route

app.post("/register" , function(req , res){
    const newuser = new user({
        email : req.body.username ,
        password : req.body.password
    })

    newuser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find the user by email
    user.findOne({ email: username })
        .then(foundUser => {
            if (!foundUser) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Compare the provided password with the stored password
            if (password !== foundUser.password) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // If the password matches, return success response
            console.log("User found");
            return res.render("secrets");
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        });
});




app.listen(3000 , function(){
    console.log("Server running on port 3000")
})