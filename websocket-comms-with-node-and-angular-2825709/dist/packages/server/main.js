/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/server/src/app/user-manger.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserManger = void 0;
const ws_1 = __webpack_require__("ws");
class UserManger {
    constructor() {
        this.Sockets = new Set();
    }
    add(socket) {
        this.Sockets.add(socket);
    }
    remove(socket) {
        this.Sockets.delete(socket);
    }
    send(socket, message) {
        socket.send(` ${JSON.stringify(message)}`);
    }
    sendAll(NewSocket, data, user) {
        let payload;
        if (data.event == "System Notice") {
            payload = JSON.stringify(data);
        }
        else if (data.event == "Chat Relay") {
            data.authoer = user;
            payload = JSON.stringify(data);
        }
        else {
            payload = JSON.stringify(data);
        }
        this.Sockets.forEach((socket) => {
            if (socket != NewSocket) {
                if (socket.readyState == ws_1.WebSocket.OPEN) {
                    socket.send(payload);
                }
            }
        });
    }
    seeonline(soc) {
        if (this.Sockets.size > 0) {
            const onlineUsers = Array.from(this.Sockets).map((socket) => {
                if (socket.readyState == ws_1.WebSocket.OPEN) {
                    return socket.socketUser;
                }
            });
            return JSON.stringify(onlineUsers);
        }
    }
}
exports.UserManger = UserManger;


/***/ }),

/***/ "./packages/server/src/app/ws-handler.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wshandler = void 0;
const ws_1 = __webpack_require__("ws");
const user_manger_1 = __webpack_require__("./packages/server/src/app/user-manger.ts");
let id = 1;
class Wshandler {
    intial(option) {
        this.ws = new ws_1.WebSocketServer(option);
        this.usermanger = new user_manger_1.UserManger();
        this.ws.on("listening", () => { console.log(`listinning on ${option.port}`); });
        this.ws.on("connection", (socket, req) => this.onsocketconection(socket, req));
    }
    onsocketconection(socket, req) {
        const queryParams = new URL(req.headers.host + req.url);
        const name = queryParams.searchParams.get("name");
        if (name == null || name.trim() == "") {
            const replay = { event: "System Notice", contents: "Please Enter Valid Name" };
            socket.send(JSON.stringify(replay));
            this.onsocketclose(socket, 404, "notvalid");
            socket.close(1000);
        }
        const user = {
            name: name || "UnKnowen",
            id: id++
        };
        socket.socketUser = user;
        this.usermanger.send(socket, { event: "loginMessage", user });
        this.usermanger.add(socket);
        this.usermanger.sendAll(socket, { event: "System Notice", contents: `${socket.socketUser.name} connected ` });
        this.usermanger.send(socket, { event: "System Notice", contents: `Welcom ${socket.socketUser.name} ` });
        this.usermanger.send(socket, { event: "chat", contents: this.usermanger.seeonline(socket) });
        this.usermanger.sendAll(socket, { event: "chat", contents: this.usermanger.seeonline(socket) });
        socket.on("message", (data) => this.onsocketmessage(socket, data, user));
        socket.on("ping", (socket) => this.onping(socket));
        socket.on("close", (code, reason) => this.onsocketclose(socket, code, reason));
    }
    onsocketmessage(socket, data, user) {
        const payload = JSON.parse(`${data}`);
        this.usermanger.send(socket, { event: "System Notice", contents: "reacived" });
        this.usermanger.sendAll(socket, payload, user);
    }
    onsocketclose(socket, code, reason) {
        this.usermanger.remove(socket);
        this.usermanger.sendAll(socket, { event: "System Notice", contents: `${socket.socketUser.name} Disconnected ` });
        this.usermanger.sendAll(socket, { event: "chat", contents: this.usermanger.seeonline(socket) });
        console.log(`connection closed ${code} ${reason} `);
    }
    onping(socket) {
        console.log("pinged");
        this.usermanger.send(socket, { event: "System Notice", contents: `${this.usermanger.seeonline(socket)}` });
    }
}
exports.Wshandler = Wshandler;


/***/ }),

/***/ "ws":
/***/ ((module) => {

module.exports = require("ws");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ws_handler_1 = __webpack_require__("./packages/server/src/app/ws-handler.ts");
function main() {
    const option = { port: 8080 };
    const wsHandler = new ws_handler_1.Wshandler();
    wsHandler.intial(option);
}
main();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map