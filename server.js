import dotenv from 'dotenv'
dotenv.config();
import express, { json } from 'express'
import cors from 'cors'
import connectDB from  './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';
const app = express();
app.use(cors());



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//* true - > Nested Objects (Correct)
//* false -> Nested Objects (Not Correctl)







const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017"




connectDB(DATABASE_URL);   //* <-- ConnectDB Mongodb call




//* Load Routes
app.use("/api/user",userRoutes)











app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});