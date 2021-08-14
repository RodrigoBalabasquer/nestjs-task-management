import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService:TasksService){
        this.tasksService = tasksService;
    }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]>{
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string): Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id:string): Promise<void>{
        return this.tasksService.deleteTaskById(id);
    }

    @Put('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatus: UpdateTaskStatusDto
    ): Promise<Task> {
        const { status } = updateTaskStatus;
        return this.tasksService.updateTaskStatus(id,status);
    }

    @Post()
    createTask(
        @Body() request: CreateTaskDto
    ):Promise<Task>{
        return this.tasksService.createTask(request);
    }
}
