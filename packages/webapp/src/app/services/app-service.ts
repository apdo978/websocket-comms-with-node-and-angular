import { Injectable } from "@angular/core";
import { User, WsMessage } from "@websocket/types";
import { BehaviorSubject, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";




@Injectable()
export class AppServcie{
user$ = new BehaviorSubject<User>(null)
messages$ = new Subject<WsMessage>()
ActiveUsers$ = new Subject<WsMessage>()
notification$ = new Subject<WsMessage>()
socket:WebSocketSubject<WsMessage>
    connect(name:string){
        // url
        this.socket =  webSocket(`ws://localhost:8080?name=${name}`)
        this.socket.subscribe((mess:WsMessage)=>this.onMessagearrive(mess))
    }
    send(messageFromUser:string,user:User){
        const payload:WsMessage = {event:"Chat Relay",contents:messageFromUser,authoer:user}
        this.socket.next(payload)
    }
    onMessagearrive(mess:WsMessage){
        console.log(mess);
        
        switch(mess.event){
            case "loginMessage":{
                this.user$.next(mess.user)
                break
            }
            case "chat"  :{
                
                this.ActiveUsers$.next(mess)

                break
            }
            case "Chat Relay":{
                this.messages$.next(mess)
                break
            }
            case "System Notice":{
                this.notification$.next(mess)
            } 

        }
    }
}