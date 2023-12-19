const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173"
    },
    connectionStateRecovery: {}
})
const { port } = require('./Config/index')
const PORT = port || 8000
const UserRoutes = require('./Router/UserRoutes');
const CommonRoutes = require('./Router/CommonRoutes')
const ContactRoutes = require('./Router/ContactRoutes')
const ChatRoutes = require('./Router/ChatRoutes')
const errorHandler = require('./Middlewares/errorHandler');
const connectDB = require('./Config/dbConnection')
connectDB()

// Cors Unblocking
const cors = require('cors');
const { sendMessage } = require('./Controller/ChatController');

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
app.use('/api/v1/contact', ContactRoutes)
app.use('/api/v1/chat', ChatRoutes)

app.get("/", (req, res)=> {
    return res.sendFile(__dirname+'/index.html')
})


io.on('connection', (socket)=> {
    console.log('a user connected')

    socket.on('chat message', async (data) => {
      const { msg, userInfo, contact_id } = data

      const insertion = await sendMessage({ message: msg, message_type: 'string', contact_id, current_id: userInfo._id });

      let new_message = insertion.data

      io.emit('chat_message', new_message);

    });

    socket.on('disconnect', ()=>{
        console.log("user disconnect")
    })
})

app.use(errorHandler)

server.listen(PORT, ()=> {
    console.log(`Current server run on port ${PORT}`)
});
