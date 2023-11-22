const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const { port } = require('./Config/index')
const PORT = port || 8000
const UserRoutes = require('./Router/UserRoutes');
const errorHandler = require('./errorHandler');
const connectDB = require('./Config/dbConnection')
connectDB()

app.use(express.json())
app.use('/api/v1/user', UserRoutes)

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
