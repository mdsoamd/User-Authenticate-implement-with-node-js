import UserModel from '../models/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'


class userController {






    //TODO User Registration & SignUp Function create
    static userRegistration = async (req,resp) =>{

       //* req provide user data
       const {name, email,phone,age,password,password_confirmation,tc} = req.body
       // const {name, email,password,password_confirmation} = req.body

        const user = await UserModel.findOne({email:email});   //* <-- User Find Database this code

        if(user){
            resp.status(422).json({"status":"failed","message":"Email already exists"})
        }else{
             
            if(name && email && phone && age && password && password_confirmation){

                if(password === password_confirmation){

                    try{
                       
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password,salt)  //* <-- User Password hash this code
                        
                        //* User Data add Database
                        const doc = new UserModel({
                            name:name,
                            email:email, 
                            phone:Number.parseInt(phone),
                            age:Number.parseInt(age),
                            // phone:phone,
                            // age:age,
                            password:hashPassword,
                            tc:tc
                        })
    
                        await doc.save()

                        const saved_user = await UserModel.findOne({email:email})   //* <-- User Find Database
                         
                        //* generate JWT token        user id            SECRET_KEY               token expiry time
                       const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:"30d"});
                        
                        
                        resp.status(201).json({"status":"success","message":" Register Successfully","token":token})

                    }catch(err){
                        console.log(err);
                        resp.status(500).json({"status":"failed","message":"Unable to Register"})
                    }
                   
                }else{
                   resp.status(422).json({"status":"failed","message":"password and Confirm password doesn't match"})
                }
                 
            }else{
                resp.json({"status":"failed","message":"All fielde are required "})
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

                    resp.json({"status":"success","message":" Login Successfully","token":token})
                    
                }else{
                    resp.status(400).json({"status":"failed","message":"Email or Password is not valid"})
                }

            }else{
                resp.status(400).json({"status":"failed","message":"You are not a Register User "})
            }
            

        }else{
          resp.status(400).json({"status":"failed","message":"All fielde are required "})
        }
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({"status":"failed","message":"Unable to login"})
    }


  }













 //TODO  Change User Password Function create        ( iske liye Old password required Nahin Hai )
// static changeUserPassword = async(req,resp)=>{

//       //* req user provide data
//     const {password, password_confirmation} = req.body

    
//     if(password && password_confirmation){

//         if(password !== password_confirmation){
//            resp.status(400).send({"status":"failed","message":"New Password and Confirm New Password doesn't match"})
//         }else{

//             const salt = await bcrypt.genSalt(10)
//             const newHashPassword = await bcrypt.hash(password,salt)   //* <-- Password hash code
             
//             //* Find User _id Database
//              await UserModel.findByIdAndUpdate(req.user._id,{
//               $set:{
//                 password:newHashPassword
//               }
//             })

            
//             resp.send({"status":"success","message":" password changed Successfully"})

//         }

          
//     }else{
//        resp.status(400).send({"status":"failed","message":"All fielde are required "})
//     }



    
// }








  
 //TODO  Change User Password Function create          ( iske liye Old password required Hai )
static changeUserPassword = async(req,resp)=>{

      //* req user provide data
    const {old_password,password, password_confirmation} = req.body

    
    if(password && password_confirmation && old_password){

      const user = await UserModel.findOne({email:req.user.email});  //* <-- User Find Database code


                               //*    old_password compare database user password
      const isMatch = await bcrypt.compare(old_password,user.password);   //* Check Old password
      
      //* isMatch result --> True & false

       if(isMatch){
        
       if(password !== password_confirmation){
           resp.status(400).json({"status":"failed","message":"New Password and Confirm Password doesn't match"})
        }else{

            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password,salt)   //* <-- Password hash code
             
            //* Find User _id Database  
             await UserModel.findByIdAndUpdate(req.user._id,{
              $set:{
                password:newHashPassword       //* <-- User provide New Passsword Update code
              }
            })

            
            resp.send({"status":"success","message":" Password Changed Successfully"})

        }
        }else{
           resp.status(400).json({"status":"failed","message":"'Old Password does not matched'"})
        }

          
    }else{
       resp.status(400).json({"status":"failed","message":"All fielde are required "})
    }



    
}
  
  
  
  
  





 //TODO User Data Get Function Create
static loggedUser = async (req,resp)=>{
    resp.json({'user':req.user})
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
         
         
         resp.json({"status":"success","message":"Password Reset Email sent... Please Check Your ","token":link})

        }else{
            resp.status(400).json({"status":"failed","message":"Email doesn't exists"})
        }
        
    }else{
        resp.status(401).json({"status":"failed","message":"Email Field is Required"})
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







  
 //TODO  User NameUpdate Function create       
static NameUpdate = async(req,resp)=>{

  
      //* req user provide data
    const {name} = req.body

    
    if(name != null && name != ""){


      try {
             
        //* Find User _id Database
        await UserModel.findByIdAndUpdate(req.user._id,{
          $set:{
            name:name
          }

        })

        resp.send({"status":"success","message":" Name Update Successfully"})
  
        } catch (error) {
          console.log(error);
          resp.status(500).json({"status":"failed","message":"Server error"})
        }
      
      
      
       
    }else{
      resp.status(401).send({ "status": "failed", "message": "Name Field are Required" })

    }

    



}









 //TODO  User PhoneNumberUpdate Function create        
static PhoneNumberUpdate = async(req,resp)=>{

      //* req user provide data
    const {phone} = req.body

    if(phone == null && phone == ""){
          resp.status(401).send({ "status": "failed", "message": "phone Field are Required" })
    }else{
      try {
             
        //* Find User _id Database
        await UserModel.findByIdAndUpdate(req.user._id,{
          $set:{
            phone:Number.parseInt(phone)
          }

        })
         resp.send({"status":"success","message":" Phone Number Update Successfully"})
  
          } catch (error) {
            console.log(error);
            resp.status(500).json({"status":"failed","message":"Server error"})
          }
    }

    

    
}








 //TODO User EmailUpdate Function create       
static EmailUpdate = async(req,resp)=>{

      //* req user provide data
    const {email} = req.body


     
    if(email != null && email != ""){

      const user = await UserModel.findOne({email: email})      //* <-- User Find Database

       
      if(user){
        
        resp.status(422).json({"status":"failed","message":"Email already exists"})
       
    
      }else{

        try {

          //* Find User _id Database
          await UserModel.findByIdAndUpdate(req.user._id,{
            $set:{
              email:email
            }

          })

          resp.send({"status":"success","message":" Email Id Update Successfully"})
    
          } catch (error) {
            console.log(error);
            resp.status(500).json({"status":"failed","message":"Server error"})
          }
         
      }

      
    }else{
      resp.status(401).json({"status":"failed","message":"Email Field is Required"})
    }

   

    
}









}





export default userController