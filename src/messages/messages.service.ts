import { Injectable } from '@nestjs/common'
import { MessagesRepository } from './messages.repository'

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  findOne(id: string) {
    return this.messagesRepository.findOne(id)
  }

  findAll() {
    return this.messagesRepository.findAll()
  }

  create(message: string) {
    return this.messagesRepository.create(message)
  }
}
