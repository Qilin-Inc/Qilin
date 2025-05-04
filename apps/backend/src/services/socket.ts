import { Injectable } from '@nestjs/common';
import { Server } from "socket.io";
import Redis from "ioredis";

@Injectable()
export class SocketService {
   private _io: Server;
   private pubClient: Redis;
   private subClient: Redis;

   constructor() {
        this.pubClient = new Redis({
           host: 'redis-11072.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
           port: 11072,
           username: 'default',
           password: 'WD9JVrpeVCNr8o1OpnzUlZthe4BY4BxM'
       });
       this.subClient = new Redis({
           host: 'redis-11072.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
           port: 11072,
           username: 'default',
           password: 'WD9JVrpeVCNr8o1OpnzUlZthe4BY4BxM'
       });
       this._io = new Server({
           cors: {
               allowedHeaders: ["*"],
               origin: "*",
           }
       });
       this.subClient.subscribe('chat:message');
   }

   public initListeners() {
       const io = this._io;
       console.log("Initializing listeners");
       io.on("connection", (socket) => {
           console.log("A user connected", socket.id);
           socket.on('event:message', async ({message}: {message: string}) => {
               console.log("Message received", message);
               await this.pubClient.publish('chat:message', JSON.stringify({
                   message,
                   socketId: socket.id,
               }));
           });
       });

       this.subClient.on('message', (channel, message) => {
           console.log("Message received from Redis", message);
           if (channel === 'chat:message') {
               const parsedMessage = JSON.parse(message);
               io.emit('chat:message', parsedMessage.message);
           }
       });
   }

   public get io() {
       return this._io;
   }
}

export default SocketService;
