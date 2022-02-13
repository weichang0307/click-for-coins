const express = require('express')
const SocketServer = require('ws').Server
const app=express()
let PORT = process.env.PORT || 3000
const server = app.listen(PORT,function () {
    let port = PORT
    let host = server.address().address
    console.log("Example app listening at http://%s:%s", host, port)

})

app.use('/',express.static('page'))

const wss = new SocketServer({server})

let money=0
wss.on('connection', ws => {

    //連結時執行此 console 提示
    ws.send(money)
    //console.log('Client connected')
    ws.on('message',buf=>{
        money+=1
        
        wss.clients.forEach(client=> {
            client.send(money)
            
        })
        
        
    })
    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
    })
})


