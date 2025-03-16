import { Component, OnInit } from '@angular/core';
import { User, WsMessage } from "@websocket/types";
import { AppServcie } from './services/app-service';

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private appService:AppServcie){
  }
currntUser:User 
messages:object[] = [];
notarr:WsMessage[]=[];
avtiveUsers:string[]=[]

  ngOnInit() {
   this.appService.user$.subscribe(user =>{
     return this.currntUser = user
    } 
  )
  this.appService.messages$.subscribe(replay=>{
    
      this.messages.push(replay);
    });
    this.appService.notification$.subscribe(notif=>{
      console.log(notif);
      
      this.notarr.push(notif)})
      this.appService.ActiveUsers$.subscribe(uersArr=>
        {
            if (uersArr.event == "chat") {
          
             this.avtiveUsers = JSON.parse(uersArr.contents)
        }
        
        }
        
      )
  }

send(input:HTMLInputElement){
this.appService.send(input.value,this.currntUser)

console.log(this.currntUser.name,"newwwwww");
this.messages.push(
  
  {event:"user-chat",authoer:this.currntUser,"contents":input.value}
  
);
input.value = ""


    }

connect(input:HTMLInputElement){

  this.appService.connect(input.value)
  
 
}

}