const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({path : path.join(__dirname , ".env")})

const connectDB = async()=>{
    try{
        await mongoose.connect(
            //url 
            process.env.MONGO_URL,
            {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
				autoIndex: false,
			}
        )
        console.log("Connect Database")
    }catch(err){
        throw new Error(err)
    }
}

const disconnectDB = async()=>{
    try{
        await mongoose.disconnect()
        console.log("Disconnect Database")
    }catch (err){
        throw new Error(err) 
    }
}

module.exports = { connectDB , disconnectDB}