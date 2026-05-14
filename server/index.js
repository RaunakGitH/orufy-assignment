const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const connectDb = require("./db")
const { success } = require("zod")

dotenv.config()

connectDb();


const app = express()

app.use(cors({
    origin: process.env.CLIENT_URI || 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))


app.use('/api/auth',require('./routes/auth'))
app.use('/api/products',require('./routes/products'))


app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    })
})





const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Server started at port: ${PORT}")
})