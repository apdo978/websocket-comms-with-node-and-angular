// set of sockets  helper methode to mange them 
import { User, WsMessage } from "@websocket/types";
import { WebSocket} from "ws"
import { WebSocketpluse } from "./ws-handler";

export class UserManger{

    private Sockets = new Set<WebSocketpluse>()

    
    add(socket:WebSocketpluse){
this.Sockets.add(socket)

    }

    remove(socket:WebSocketpluse){
this.Sockets.delete(socket)

    }

    send(socket:WebSocketpluse, message:WsMessage){
       
         
            socket.send( ` ${JSON.stringify(message)}`)

        
    
        
        
 }
  
    
    sendAll(NewSocket,data:WsMessage,user?:User){
        let payload;
        if (data.event == "System Notice"){
            
             payload = JSON.stringify(data)
        }
        else if (data.event == "Chat Relay"){
            data.authoer = user
             payload = JSON.stringify(data)

        }
        else{
            payload = JSON.stringify(data)
        } 
        
        
        this.Sockets.forEach((socket)=>{
            if(socket != NewSocket){
            if (socket.readyState == WebSocket.OPEN){    
                    
                    socket.send(payload)
                
             }
            }
            
        })
    }

   seeonline(soc:WebSocketpluse){
    if(this.Sockets.size > 0){
        const onlineUsers = Array.from(this.Sockets).map((socket)=>{
            if (socket.readyState == WebSocket.OPEN){
               return socket.socketUser
             }
 
    })

    return JSON.stringify(onlineUsers)
   }
}
}