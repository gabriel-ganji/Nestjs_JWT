import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseInIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { ReqDataParam } from 'src/common/params/req-data-param.decorator';

@UseInterceptors(AuthTokenInterceptor)
@Controller('message')
// If @UseInterceptors(AddHeaderInterceptor) stays above the class all methods will be able to use it
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //Route to find all messages
  @HttpCode(201)
  @Get()
  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  async findAll(
    @Query() pagination: PaginationDto,
    @ReqDataParam('method') method,
  ) {
    // console.log('MessageController: ', req['user']);
    console.log(method);
    const messages = this.messageService.findAll(pagination);
    return messages;
  }

  //Route to find one message
  @Get(':id')
  @UsePipes(ParseInIdPipe)
  @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  //Route to create/insert data in dbS
  @Post()
  create(@Body() createBodyDto: CreateMessageDto) {
    return this.messageService.create(createBodyDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
