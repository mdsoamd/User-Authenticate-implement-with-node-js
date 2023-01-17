import mongoose from 'mongoose'




const connectDB = async (DATABASE_URL) => {


    try{
      
        const DB_OPTIONS = {
            dbName:"Authenticate"    //* <-- Database Name 
        }

        
        mongoose.set('strictQuery', false);
        await mongoose.connect(DATABASE_URL,DB_OPTIONS,{    //* <-- Connect Database
            useNewUrlParser: true,
            useCreateIndex:true,
            useUnifiedTopology: true,
            useFindAndModify : false
        }).then(()=>{
            console.log("connected successfully...");
        });
          

    }catch(err){
      console.log("MongoDB Atlas connection failed:"+ err);
    }
    
    
}



export default connectDB