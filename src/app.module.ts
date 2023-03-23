import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsController } from './cats/cats.controller'
import { MessagesModule } from './messages/messages.module'

@Module({
  imports: [MessagesModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
