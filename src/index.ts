import  express  from "express";
import cors  from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.DB_location as string)


const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.get('/api/test',async(req,res)=>{
    res.json({message:"Hello TS"})
})


app.listen(3005,()=>{
    console.log("running on port 3005")
})