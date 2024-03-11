import { Logger as CommonLogger } from "@nestjs/common";

const request = { id: '', url: '' };

class Logger {
  private static instance: Logger;
  private logger: CommonLogger;

  constructor() {
    if (!!!Logger.instance) {
      this.logger = new CommonLogger('MsTransaction');
    }
  }

  public getRequest(): any {
    return request;
  }

  public setRequest(req_id: string, url: string): void {
    request.id = req_id;
    request.url = url;
  }

  public error(error: any): void {
    this.logger.error({ request, err: error});
  }

  public log(info: any): void {
    this.logger.log({request}, info);
  }

  public warn(warn: any): void {
    this.logger.warn({request}, warn);
  }
}

export default Logger;