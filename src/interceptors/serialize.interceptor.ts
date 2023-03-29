import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { plainToClass } from 'class-transformer'

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(this.dto, data, { excludeExtraneousValues: true })
      }),
    )
  }
}

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto))
}
