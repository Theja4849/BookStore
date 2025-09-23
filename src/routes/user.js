import { Router } from "express";
import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
const UserRouter = Router();

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password)

}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const JWT_SECRET_KEY=process.env.JWT_SECRET


UserRouter.post('/', async (req, res) => {
    try {
        const { userName, email, password, gender } = req.body
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Missing required field    " })
        }

        //check email
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid Email format" })

        }

        //check password
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'password must be atleast 8 characters include uppercase,lowercase,number and special character' })
        }

        //gender check
        if (gender) {
            const validGenders = ["male", "female", "other"];
            if (!validGenders.includes(gender.toLowerCase())) {
                return res.status(400).json({ message: "Gender must be male, female, or other" });
            }
        }

        //check if user already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        //Hash password
        const hashPassword = await bcrypt.hash(password, 10)

        //create user
        const user = await User.create({
            userName,
            email,
            password: hashPassword,
            gender
        })
        return res.status(201).json({ message: 'user created successfully..', data: user })
    }
    catch (err) {
        console.log("error in creating user", err)
        res.status(500).json("Internal Server Error")
    }
})

UserRouter.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        console.log(JWT_SECRET_KEY)
        
        
        if(!email || !password){
           return  res.status(400).json({message:"email or password is required"})
        }

        //validate email
        if(!validateEmail(email)){
           return res.status(400).json({message:"Invalid Email Fromat"})
        }

        //find user by email
        const existingUser=await User.findOne({where:{email}})
        if(!existingUser){   
           return  res.status(401).json({message:"Invalid email or passroed"})
        }

        //compare password
        const isPasswordMatch= await bcrypt.compare(password,existingUser.password)
        if(!isPasswordMatch){
           return res.status(401).json({message:"Invalid email or passroed"})
        }

        //generate JWT token
        const token =jwt.sign(
            {id:existingUser.id,email:existingUser.email},
            JWT_SECRET_KEY,
            {expiresIn:"24h"}
        );
        return res.status(200).json({message:"Login succesfull...",token:token})

    }
    catch(err){
        console.log(err)
      return  res.status(500).json({message:"Internal Server Error"})
    }

})
export default UserRouter