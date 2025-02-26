import { ValidationPipe } from '../../shared/validation.pipe';
import { RemoveTodoCommand } from '../../domain/todo/commands/removeTodo.command';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateTodoDto, UpdateTodoDto } from './dtos';
import { Todo } from '../../domain/todo/todo.entity';
import {
  CreateTodoCommand,
  UpdateTodoCommand,
} from '../../domain/todo/commands';
import { GetAllTodosQuery, GetOneTodoQuery } from '../../domain/todo/queries';

@UsePipes(new ValidationPipe())
@Controller('todo')
export class TodoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createTodo(@Body() dto: CreateTodoDto) {
    // console.log(dto);
    return this.commandBus.execute(new CreateTodoCommand(dto));
  }

  @Get()
  async findAllTodo(): Promise<Todo[]> {
    return this.queryBus.execute(new GetAllTodosQuery());
  }

  @Get(':id')
  async findOneTodo(@Param('id') id: string): Promise<Todo> {
    return this.queryBus.execute(new GetOneTodoQuery(id));
  }

  @Patch(':id')
  async updateTodo(@Body() dto: UpdateTodoDto, @Param('id') id: string) {
    console.log(dto);
    return this.commandBus.execute(new UpdateTodoCommand(id, dto));
  }

  @Delete(':id')
  async removeTodo(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveTodoCommand(id));
  }
}
