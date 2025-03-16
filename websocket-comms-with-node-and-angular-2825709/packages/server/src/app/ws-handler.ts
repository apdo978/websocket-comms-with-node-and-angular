// abdelrhmanmuhamed.muhammed@concentrix.com
import { IncomingMessage } from "http";
import {WebSocket,WebSocketServer,ServerOptions, RawData} from "ws"
import { UserManger } from "./user-manger";
import { User, WsMessage } from "@websocket/types";
  export interface WebSocketpluse extends  WebSocket {
        socketUser:User
     }

let id = 1
export class Wshandler{

private ws:WebSocketServer
private usermanger:UserManger

intial (option:ServerOptions){
     this.ws = new WebSocketServer(option)
     this.usermanger = new UserManger()
        this.ws.on("listening", ()=>{console.log(`listinning on ${option.port}`);})

        this.ws.on("connection", (socket:WebSocketpluse,req)=>this.onsocketconection(socket,req))}

onsocketconection(socket:WebSocketpluse,req:IncomingMessage){

          const queryParams = new URL(req.headers.host + req.url);
          
         const name = queryParams.searchParams.get("name") 
         if (name== null||name.trim() == ""){
                const replay:WsMessage={event:"System Notice",contents:"Please Enter Valid Name"}
                socket.send(JSON.stringify(replay))
                this.onsocketclose(socket, 404, "notvalid")
                socket.close(1000)
         }   
        const user:User={
                name:name||"UnKnowen",
                id:id++
        }

    socket.socketUser = user
    this.usermanger.send(socket, {event:"loginMessage",user})
        this.usermanger.add(socket)
        this.usermanger.sendAll(socket, {event:"System Notice",contents:`${socket.socketUser.name} connected `})
        this.usermanger.send(socket, {event:"System Notice",contents:`Welcom ${socket.socketUser.name} `})
        this.usermanger.send(socket, {event:"chat",contents:this.usermanger.seeonline(socket)})
        this.usermanger.sendAll(socket, {event:"chat",contents:this.usermanger.seeonline(socket)})
        
   socket.on("message", (data:RawData)=>this.onsocketmessage(socket,data,user))
   socket.on("ping",(socket:WebSocketpluse)=>this.onping(socket))
   socket.on("close", (code:number,reason:Buffer)=>this.onsocketclose(socket,code,reason))}

onsocketmessage(socket:WebSocketpluse,data:RawData,user:User){
        const payload:WsMessage = JSON.parse(`${data}`) 
        this.usermanger.send(socket, {event:"System Notice",contents:"reacived"})
this.usermanger.sendAll(socket,payload,user)
}

onsocketclose(socket:WebSocketpluse,code:number,reason:Buffer|string){
        
        this.usermanger.remove(socket)
        this.usermanger.sendAll(socket, {event:"System Notice",contents:`${socket.socketUser.name} Disconnected `})
        this.usermanger.sendAll(socket, {event:"chat",contents:this.usermanger.seeonline(socket)})
console.log(`connection closed ${code} ${reason} `);}
onping(socket:WebSocketpluse){
        console.log("pinged");
        
 this.usermanger.send(socket, {event:"System Notice",contents:`${this.usermanger.seeonline(socket)}`})
}
}
