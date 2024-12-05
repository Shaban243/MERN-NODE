import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController   {

  @Get('getMessage')
  getHello(): string  {
    return 'Hello World'
  }
  
}
