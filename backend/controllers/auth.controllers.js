import bcrypt from "bcryptjs"
import User from "../models/user.Model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";




export const singup = async(req , res)=>{
    try{
     const {fullName , username , password, confirmpassword, gender} = req.body;
     if(password!==confirmpassword){
        return res.status(400).json({error:"password don't match"})
     }

     const user = await User.findOne({username});
     if(user){
        return res.status(400).json({error:"user already exist"})
     }

     // hash password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

     // https://avatar-placeholder.iran.liara.run/

     const boyProfilPic = `https://avatar.iran.liara.run/public/boy?username=${username}`
     const girlProfilPic = `https://avatar.iran.liara.run/public/girl?username=${username}`

     const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender=="male"? boyProfilPic  :girlProfilPic
     })

     if(newUser){
        // genrate JWT token here
       generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
           _id:newUser._id,
           fullName: newUser.fullName,
           username: newUser.username,
           profilePic: newUser.profilePic
        })
     }else{
        res.status(400).json({error:"invailid user data"})
     }

    }catch(error){

        console.log("error in signup controller " ,{error});
        res.status(500).json({error:"enternal server error"})
    }
}

export const login = async (req , res)=>{
    try{
        
        const {username, password} = req.body;
        const user = await User.findOne({username});

        const isPosswordCorrect = bcrypt.compare(password. user?.password ||"" );
        if(!user || !isPosswordCorrect){
            return res.status(400).json({error:"invvailid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic
        })
   
       }catch(error){
   
           console.log("error in login controller " ,{error});
           res.status(500).json({error:"enternal server error"})
       }
   }


export const logout = (req , res)=>{
  try{
     
      res.cookie("jwt", "",{maxAge:0});
      res.status(200).json({message:"loged out succesfully"});


  }catch(error){
    console.log("error in logout controller " ,{error});
    res.status(500).json({error:"enternal server error"})
  }
}

