import UserModel from '../models/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'


class userController {






    //TODO User Registration & SignUp Function create
    static userRegistration = async (req,resp) =>{

       //* req provide user data
        const {name, email,phone,age,password,password_confirmation,tc} = req.body

        const user = await UserModel.findOne({email:email});   //* <-- User Find Database this code

        if(user){
            resp.status(422).send({"status":"failed","message":"Email already exists"})
        }else{
             
            if(name && email &&  phone && age && password && password_confirmation){

                if(password === password_confirmation){

                    try{
                       
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password,salt)  //* <-- User Password hash this code
                        
                        //* User Data add Database
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            phone:phone,
                            age:age,
                            password:hashPassword,
                            tc:tc
                        })
    
                        await doc.save()

                        const saved_user = await UserModel.findOne({email:email})   //* <-- User Find Database
                         
                        //* generate JWT token        user id            SECRET_KEY               token expiry time
                       const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:"30d"});
                        
                        
                        resp.status(201).send({"status":"success","message":" Register Successfully","token":token})

                    }catch(err){
                        console.log(err);
                        resp.status(500).send({"status":"failed","message":"Unable to Register"})
                    }
                   
                }else{
                   resp.status(422).send({"status":"failed","message":"password and Confirm password doesn't match"})
                }
                 
            }else{
                resp.status(422).send({"status":"failed","message":"All fielde are required "})
            }
        }
    }



    


  





 //TODO User Login Function create
  static userLogin = async (req,resp)=>{

    try {
        
       //* req provide user email or password
        const {email,password} = req.body
         

        //* Check email or password not null
        if(email && password){

            const user = await UserModel.findOne({email:email});  //* <-- User Find Database code
            
          //* Database find user
            if(user != null){
                 
                //* password bcrypt Database password or user provide password compare code
                const isMatch = await bcrypt.compare(password,user.password)

                if((user.email === email) && isMatch){

                     //* generate JWT token
                     const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"30d"});

                    resp.send({"status":"success","message":" Login Successfully","token":token})
                    
                }else{
                    resp.status(400).send({"status":"failed","message":"Email or Password is not valid"})
                }

            }else{
                resp.status(400).send({"status":"failed","message":"You are not a Register User "})
            }
            

        }else{
          resp.status(400).send({"status":"failed","message":"All fielde are required "})
        }
        
    } catch (error) {
        console.log(error);
        resp.status(500).send({"status":"failed","message":"Unable to login"})
    }


  }













 //TODO  Change User Password Function create
static changeUserPassword = async(req,resp)=>{

      //* req user provide data
    const {password, password_confirmation} = req.body

    
    if(password && password_confirmation){

        if(password !== password_confirmation){
           resp.status(400).send({"status":"failed","message":"New Password and Confirm New Password doesn't match"})
        }else{

            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password,salt)   //* <-- Password hash code
             
            //* Find User _id Database
             await UserModel.findByIdAndUpdate(req.user._id,{
              $set:{
                password:newHashPassword
              }
            })

            
            resp.send({"status":"success","message":" password changed Successfully"})

        }

          
    }else{
       resp.status(400).send({"status":"failed","message":"All fielde are required "})
    }



    
}
  
  
  
  
  





 //TODO User Data Get Function Create
static loggedUser = async (req,resp)=>{
    resp.send({'user':req.user})
}
  
  
  



  



 //TODO Send UserPasswordResetEmail Function create
static sendUserPasswordResetEmail = async (req,resp)=>{

    const {email} = req.body

    if(email){

        const user = await UserModel.findOne({email: email})      //* <-- User Find Database
        
        if(user){
          const secret = user._id + process.env.JWT_SECRET_KEY   
          const token = jwt.sign({userID:user._id},secret,{       //* <-- generate Token
            expiresIn: '15m'
          })

         const link = (`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`);
         console.log(link);


        //TODO Send Email
        // let info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: user.email,
        //   subject: "GeekShop - Password Reset Link",
        //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
        // })
         
         
         resp.send({"status":"success","message":"Password Reset Email sent... Please Check Your ","token":link})

        }else{
            resp.status(400).send({"status":"failed","message":"Email doesn't exists"})
        }
        
    }else{
        resp.status(401).send({"status":"failed","message":"Email Field is Required"})
    }
}










 //TODO UserPasswordReset Function create
static userPasswordReset = async(req, resp) => {

    const { password, password_confirmation } = req.body
    const { id, token } = req.params

    const user = await UserModel.findById(id)  //* <-- This code User id Find 
    const new_secret = user._id + process.env.JWT_SECRET_KEY

    try {

      jwt.verify(token, new_secret) //* <-- verify user this code
      
      if (password && password_confirmation) {

        if (password !== password_confirmation) {

          resp.status(400).send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })

        } else {

          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)  //* <-- Password hash code

          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } }) //* New Password Save Database
          resp.send({ "status": "success", "message": "Password Reset Successfully" })

        }

      } else {

        resp.status(401).send({ "status": "failed", "message": "All Fields are Required" })

      }
    } catch (error) {
      console.log(error)
      resp.status(400).send({ "status": "failed", "message": "Invalid Token" })

    }



  }








}





export default userController