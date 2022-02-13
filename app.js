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
const   MongoClient= require('mongodb').MongoClient
let uri="mongodb+srv://wei:wiechang0307@cluster0.oxvaa.mongodb.net/sample_analytics?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function find_db(){
    console.time('connect')
    try{
        await client.connect()
    }catch(e){
        console.log('failed to connect to cluster0')
        return 'failed to connect to cluster0'
    }
    console.timeEnd('connect')
    let coll_=client.db("my_test_db").collection("click_money")
    let result=await coll_.findOne({name:'money'})
    money=result.money
    console.log(money)
}
find_db()





async function update_db(){
    console.time('connect')
    try{
        await client.connect()
    }catch(e){
        console.log('failed to connect to cluster0')
        return 'failed to connect to cluster0'
    }
    console.timeEnd('connect')
    let coll_=client.db("my_test_db").collection("click_money")
    coll_.updateOne({name:'money'},{$set:{money:money}})
    return money
        

        
        
    
}
setInterval(update_db,30*60*1000)


