import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server, Socket } from 'socket.io';
import { INestApplication } from '@nestjs/common';

import { UserFacade } from './user/user.facade';
import { UserEntity } from './user/user.entity';
import { NotificationPort } from './notification/notification.port';

export class SocketAdapter extends IoAdapter {
  private readonly userFacade: UserFacade;
  private readonly notificationPort: NotificationPort;

  constructor(app: INestApplication) {
    super(app);
    this.userFacade = app.get(UserFacade);
    this.notificationPort = app.get(NotificationPort);
  }

  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ): Server {
    const server: Server = super.createIOServer(port, { ...options, cors: { origin: '*' } });
    this.notificationPort.attach(server);

    server.use(async (socket: Socket, next: (err?: any) => void) => {
      const userId: unknown = socket.handshake.query.userId;
      const user: UserEntity | null = await this.userFacade.getById(userId as string);

      if (user) {
        socket.user = user;
        next();
      } else {
        next(new Error());
      }
    });

    return server;
  }
}
