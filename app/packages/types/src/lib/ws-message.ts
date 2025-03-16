import { User } from "./types"

export type WsMessage = ChatMessage | RelayMessage | SystemNotice | LoginMessage

 interface ChatMessage  {
event:"chat",
contents:string
}

 interface RelayMessage {
event:"Chat Relay",
contents:string,
authoer:User
}
 interface SystemNotice {
event:"System Notice",
contents:string,
}
interface LoginMessage {
    event:"loginMessage"
    user:User
}