import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class NotificationPort {
  private server: Server | null = null;

  attach(server: Server): void {
    this.server = server;
  }

  send(usersOrRoom: string[] | string, type: string, ...args: unknown[]): void {
    if (!Array.isArray(usersOrRoom)) {
      this.server?.to(usersOrRoom).emit(type, ...args);
      return;
    }

    this.server?.sockets.sockets.forEach((socket: Socket) => {
      if (usersOrRoom.includes(socket.user.getId())) {
        socket.emit(type, ...args);
      }
    });
  }
}
