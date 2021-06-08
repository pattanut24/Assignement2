const {prepare , mockDb } = require('../../util/auth_test')
const controller = require('../controller/auth')

describe('/app/auth', ()=>{
    describe("POST /app/auth/register", ()=>{
        it('basis case', async()=>{
            mockDb("User",[])
            var res = await prepare(controller).post("/register").send({email:"1234" , name :"test" , password :"1234"})
            expect(res.status).toBe(200) 
            expect(res.body.success).toBe(true)
        })

        it('Invalid Email', async()=>{
            mockDb("User",[])
            var res = await prepare(controller).post("/register").send({ name :"test" , password :"1234"})
            expect(res.status).toBe(400) 
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe('Invalid name or email or password')
        })

        it('Invalid Name', async()=>{
            mockDb("User",[])
            var res = await prepare(controller).post("/register").send({email:"1234" , password :"1234"})
            expect(res.status).toBe(400) 
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe('Invalid name or email or password')
        })

        it('Invalid Password', async()=>{
            mockDb("User",[])
            var res = await prepare(controller).post("/register").send({email:"1234" , name :"test"})
            expect(res.status).toBe(400) 
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe('Invalid name or email or password')
        })

        it('Email is already exist', async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"1234"}])
            var res = await prepare(controller).post("/register").send({email:"1234" , name :"test" , password :"1234"})
            expect(res.status).toBe(400) 
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe('Email already exist')
        })

    })

    describe("POST /app/auth/login", ()=>{
        it("Basic case", async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"$2b$10$QsKPkcfjkeG9GF3jm2HE4.sk7GBYMBZxIJfxIrEW4zbRz.tWZct9a"}])
            var res = await prepare(controller).post('/login').send({email:"1234" , password:"1234"})
            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
        })

        it("Empty Email", async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"$2b$10$QsKPkcfjkeG9GF3jm2HE4.sk7GBYMBZxIJfxIrEW4zbRz.tWZct9a"}])
            var res = await prepare(controller).post('/login').send({ password:"1234"})
            expect(res.status).toBe(400)
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe("Empty email or password")
        })

        it("Empty Password", async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"$2b$10$QsKPkcfjkeG9GF3jm2HE4.sk7GBYMBZxIJfxIrEW4zbRz.tWZct9a"}])
            var res = await prepare(controller).post('/login').send({ email:"1234"})
            expect(res.status).toBe(400)
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe("Empty email or password")
        })

        it("Invalid Email", async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"$2b$10$QsKPkcfjkeG9GF3jm2HE4.sk7GBYMBZxIJfxIrEW4zbRz.tWZct9a"}])
            var res = await prepare(controller).post('/login').send({ email:"1" , password:"1234"})
            expect(res.status).toBe(400)
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe("Invalid Email")
        })

        it("Invalid Password", async()=>{
            mockDb("User",[{email:"1234" , name :"test" , password :"$2b$10$QsKPkcfjkeG9GF3jm2HE4.sk7GBYMBZxIJfxIrEW4zbRz.tWZct9a"}])
            var res = await prepare(controller).post('/login').send({ email:"1234" , password:"1"})
            expect(res.status).toBe(400)
            expect(res.body.success).toBe(false)
            expect(res.body.error).toBe("Invalid Password")
        })
    })

})