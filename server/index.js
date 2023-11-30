const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const { port } = require('./Config/index')
const PORT = port || 8000
const UserRoutes = require('./Router/UserRoutes');
const CommonRoutes = require('./Router/CommonRoutes')
const errorHandler = require('./Middlewares/errorHandler');
const connectDB = require('./Config/dbConnection')
connectDB()

// Cors Unblocking
const cors = require('cors');

const allowedOrigins = [
  "http://localhost:5173", //your frontend URL
  // any other origins you want to allow
]

const corsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions));

app.use(express.json())
app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/common', CommonRoutes)

app.get("/", (req, res)=> {
    return res.sendFile(__dirname+'/index.html')
})


io.on('connection', (socket)=> {
    console.log('a user connected')

    socket.broadcast.emit('hi');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    socket.on('disconnect', ()=>{
        console.log("user disconnect")
    })
})

app.use(errorHandler)

server.listen(PORT, ()=> {
    console.log(`Current server run on port ${PORT}`)
});
