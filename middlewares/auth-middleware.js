import jwt from "jsonwebtoken"
import UserModel from "../models/userSchema.js"



//* Check User login then routs access   ( you user ko check Karta Hai login hai kya Nahin )
var checkUserAuth = async(req,resp,next)=>{    //* <-- Iska kaam hai yah  ( Front end se User ka token bhejega verify karne ka bad yah Route ko access de dega )
    let token 
    const {authorization} = req.headers

    if(authorization && authorization.startsWith("Bearer")){
        
       try {

        //* Get Token from header
         token = authorization.split(' ')[1]
     

         //* Verify token
         const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)   //* User Token Verify & check
        

         req.user = await UserModel.findById(userID).select('-password')  //* Find User Id   or  (select('-password') yah Dene sa password chhodka  sab send karega )
        
         next()
         
       } catch (error) {
        console.log(error)
        resp.json({"status":"failed","message":"Unauthorized User"})
       }
    }
    if(!token){
        resp.status(401).json({"status":"failed","message":"Unauthorized User No Token"})
    }



}



export default checkUserAuth