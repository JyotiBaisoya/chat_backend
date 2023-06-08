const express = require("express");
const {User} = require("../models/usermodel")
const userRouter = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"jyotibaisoya2508@gmail.com",
        pass:"anaadxvkuuonppup"
    },
    tls:{
        rejectUnauthorized:false
    },
    port:425,
    host:"smtp.gmail.com"
}) 



userRouter.post("/register",async(req,res)=>{
   
    const {username,email,password} = req.body;
   

    const hashPassword = await bcrypt.hash(password,10);

    const user = new User({
        username,
        email,
        password:hashPassword,
        isVerified:false,
   
    });

    await user.save()

    const verificationLink =`http://localhosts:8000/verify/`;
     const mailOptions ={
        from:"jyotibaisoya2508@gmail.com",
        to:email,
        subject:"Email Verification",
        text:`click on the following link to verify your email ${verificationLink}`

     }

     transporter.sendMail(mailOptions,async(err,info)=>{
        if(err){
            console.log(err);
            res.status(500).json({"error":"failed to send the mail"})
        }else{
            console.log(`verification email sent${email}`);
            res.status(200).json({"msg":"verification email sent and user registerd successfully"})
            const u = await User.findOne({email});
            const id = u._id
            const user = await User.findByIdAndUpdate(id,{isVerified:true});
          //  console.log(u)
        }
     })
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.find({email});
    console.log(user)
    try {
        if(user.length>0){
            bcrypt.compare(password,user[0].password,function(err,result){
                if(result){
                    const token = jwt.sign({foo:"bar"},"masai");
                    res.send({"msg":"logged in successfully","token":token})
                }else{
                    console.log(err);
                    res.send("Invalid credentials")
                }
            })
           }
    } catch (error) {
        console.log(error)
    }
  
});







module.exports ={userRouter}