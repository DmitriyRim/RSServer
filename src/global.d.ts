declare global {
  declare module 'socket.io' {
    interface Socket {
      user?: any;
    }
  }
}
