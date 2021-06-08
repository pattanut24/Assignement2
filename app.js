const express = require('express')
const { connectDB , disconnectDB } = require('./db/connect')
const httpShutdown = require('http-shutdown')
const todo = require('./node_app/controller/todo')
const auth = require('./node_app/controller/auth')
const dotenv = require('dotenv')
const path = require('path')
const cookieParser = require('cookie-parser') 
const { authenticateToken } = require('./shared/auth')
const db_middleware = require('./util/db_middleware')


const main = async()=>{
    dotenv.config({ path : path.join(__dirname , '.env')})

    await connectDB()

    var app = express()

    app.use(express.urlencoded({extended:false}))
    app.use(express.json())
	app.use(cookieParser())
	app.use(db_middleware)
	
    app.use('/app/auth', auth)
    
	app.use(authenticateToken)
	app.use('/app/with_auth', todo)

    // app.use( (req,res,next)=> res.status(404).send({error : "Page not found"}))


    var server = httpShutdown(app.listen(process.env.PORT));

	// graceful shutdown
	var called = false;
	const shutdown = () => {
		if (called) return;
		called = true;
		server.shutdown(async (err) => {
			try {
				await disconnectDB();
				return process.exit(0);
			} catch (e) {
				err = e;
			}
			console.error(err);
			return process.exit(1);
		});
	};
	process.once("SIGINT", shutdown).once("SIGTERM", shutdown);
}

main() 