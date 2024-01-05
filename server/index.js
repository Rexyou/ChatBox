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
const { constrainedMemory } = require('process');

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

let connectedUsers = new Map();
let currentUsers = {};

const disconnectedAction = (currentUsers, socket) => {
  for(const contact_id in currentUsers){
    for(const user_id in currentUsers[contact_id]){
      if(currentUsers[contact_id][user_id] === socket.id){
        delete currentUsers[contact_id][user_id]
      }
    }

    let final_list = currentUsers[contact_id]

    if(Object.keys(currentUsers[contact_id]).length == 0){
      delete currentUsers[contact_id]
    }

    if(!currentUsers[contact_id]){
      final_list = {}
    }

    io.emit(contact_id, final_list)
  }
}

io.on('connection', (socket)=> {
    socket.on('recorder', async (userData) => {
      console.log('recording...')
      const { contact_id, userInfo } = userData

      if(!currentUsers[contact_id]){
        currentUsers[contact_id] = {}
      }

      if(userInfo?._id !== undefined){
        
        const user_id = userInfo._id
        const socket_id = socket.id

        currentUsers[contact_id][user_id] = socket_id
        io.emit(contact_id, currentUsers[contact_id])
        
      }

      console.log(connectedUsers)
    });

    socket.on('chat message', async (data) => {

      console.log("chat message : ", connectedUsers)

      const { msg, userInfo, contact_id } = data

      const insertion = await sendMessage({ message: msg, message_type: 'string', contact_id, current_id: userInfo._id });

      let new_message = insertion.data

      io.emit('chat_message', new_message);

      io.emit('chat_notification', new_message)

    });

    socket.on('disconnect_connection', async()=> {
      disconnectedAction(currentUsers, socket)
    })

    socket.on('disconnect', ()=>{
      disconnectedAction(currentUsers, socket)
    })
})

app.use(errorHandler)

server.listen(PORT, ()=> {
    console.log(`Current server run on port ${PORT}`)
});
