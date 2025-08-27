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
  UseGuards,
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
import { ReqDataParam } from 'src/common/params/req-data-param.decorator';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';

@UseInterceptors(AuthTokenInterceptor)
@Controller('message')
// If @UseInterceptors(AddHeaderInterceptor) stays above the class all methods will be able to use it
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

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

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createBodyDto: CreateMessageDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.messageService.create(createBodyDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.update(id, updateMessageDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.remove(id, tokenPayload);
  }
}
