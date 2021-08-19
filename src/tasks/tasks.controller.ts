import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService:TasksService){
        this.tasksService = tasksService;
    }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]>{
        console.log(filterDto);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string, @GetUser() user: User): Promise<Task>{
        return this.tasksService.getTaskById(id,user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string, @GetUser() user: User): Promise<void>{
        return this.tasksService.deleteTaskById(id,user);
    }

    @Put('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatus: UpdateTaskStatusDto,
        @GetUser() user: User
    ): Promise<Task> {
        const { status } = updateTaskStatus;
        return this.tasksService.updateTaskStatus(id,user,status);
    }

    @Post()
    createTask(
        @Body() request: CreateTaskDto,
        @GetUser() user: User
    ):Promise<Task>{
        return this.tasksService.createTask(request, user);
    }
}
