import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Observable } from "rxjs";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger();

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let request = host.switchToHttp().getRequest();
    this.logger.log(request, AppExceptionFilter.name);
    
    // handle non http exception errors
    if (exception.status === undefined) {
      this.logger.error(exception.message, exception.stack, AppExceptionFilter.name);
      
      return new Observable<any>(observer => {
        observer.next({
          meta: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: exception.message
          }
        });
        observer.complete();
      });
    }

    // handle http exception errors
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    // parse logger attribute from request headers
    if (request.headers?.logger) {
      request.headers.logger = JSON.parse(request.headers.logger);
    } else {
      request.headers = { ...request.headers, logger: {} };
    }

    if (statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(exception.message, AppExceptionFilter.name);
    } else {
      this.logger.error(exception.message, exception.stack, AppExceptionFilter.name);
    }
    
    return new Observable<any>(observer => {
      observer.next({
        meta: {
          code: statusCode,
          success: false,
          message: exception.message
        }
      });
      observer.complete();
    });
  }
}