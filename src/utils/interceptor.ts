import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import Logger from "../logger";

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let log = request.headers?.logger ?? '';
    if (!!log) {
      const logger = new Logger();
      let logData: any;
      try {
        logData = JSON.parse(log);
      } catch (e) {
        logData = log;
      }
      logger.setRequest(logData.req_id ?? '', logData.url ?? '');
    }
    return next.handle();
  }
}