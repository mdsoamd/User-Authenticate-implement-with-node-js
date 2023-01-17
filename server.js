import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import connectDB from  './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017"


app.use(cors());

connectDB(DATABASE_URL);   //* <-- ConnectDB Mongodb call

app.use(express.json());


//* Load Routes
app.use("/api/user",userRoutes)











app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});