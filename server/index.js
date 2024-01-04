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

io.on('connection', (socket)=> {
    console.log('a user connected')
    console.log("socket connected id: ", socket.id)

    socket.on('recorder', async (userData) => {
      console.log('recording...')
      const { contact_id, userInfo } = userData

      if (!connectedUsers.has(contact_id)) {
        connectedUsers.set(contact_id, []);
      }

      if(userInfo?._id !== undefined){

        const contact_detail = connectedUsers.get(contact_id)
        
        const user_id = userInfo._id
        const socket_id = socket.id

        // const result = contact_detail.find((item)=> { 
        //   if(item[user_id]){
        //     item[user_id] = socket_id
        //     return true
        //   }

        //   return false
        // })

        // console.log("result : ", result)

        // if(!result || result === undefined){
          // let final_input = {};
          // final_input[user_id]=socket_id
          // contact_detail.push(final_input)
          contact_detail[user_id]=socket_id
          // Object.assign(contact_detail, {user_id: socket_id})
        // }
        
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

    socket.on('disconnect', ()=>{

      for (const [key, value] of connectedUsers.entries()) { 
        console.log("key : ", key)
        console.log("value before : ", value)
        
        for (const key2 in value){
          if(value[key2] === socket.id){
            delete value[key2]
          }
        }

        console.log("value after : ", value)
        connectedUsers.set(key, value)

        console.log(key)
        console.log(Object.keys(value).length)

        if(Object.keys(value).length == 0){
          connectedUsers.delete(key)
        }
      } 

      console.log("socket disconnect id: ", socket.id)
      console.log("user disconnect")
      console.log("current list : ", connectedUsers)
    })
})

app.use(errorHandler)

server.listen(PORT, ()=> {
    console.log(`Current server run on port ${PORT}`)
});
