import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CommentGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @WebSocketServer()
  server: Server;

  static readonly commentsRoom: string = 'comments';

  afterInit(server: Server): any {
    console.log('init');
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    console.log('client connected: ' + client.id);
    return client.join(CommentGateway.commentsRoom);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log('client disconnected: ' + client.id);
    return client.leave(CommentGateway.commentsRoom);
  }

  // todo: add auth guard
  @SubscribeMessage('comment')
  async createComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateCommentDto,
  ): Promise<boolean> {
    console.log('creating comment: ' + client.id);
    await this.commentService.createPostComment(data);
    return this.server.to(CommentGateway.commentsRoom).emit('comment', data);
  }
}
