import express, { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../models/user'

const router = express.Router()

router.post("/login", [check("email", "Email is required").isEmail(), check("password", "Password min lenght 6").isLength({ min: 6 })], async (req: Request, res: Response) => {
       const errors=validationResult(req)
       if(!errors.isEmpty()){
            return res.status(400).json({ message: errors.array() })
       }
       try {
        const {email,password}=req.body
        let user = await User.findOne({
            email: email
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid Cradentials" })
        }
        const isValidated=await bcrypt.compare(password,user.password)
        if(!isValidated){
            return res.status(400).json({ message: "Invalid Cradentials" })
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" })
        res.cookie("authToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 86400000 })
        return res.status(200).json({ userId: user._id });
        
       } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Internal server error" })
       }
})

export default router