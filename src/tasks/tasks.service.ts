import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ){}

    getTasks(filterDto: GetTaskFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if(!found)
        {
            throw new NotFoundException('Task with Id '+id+' no found');
        }
        return found;
    }

    async deleteTaskById(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);
        
        if(result.affected === 0)
        {
            throw new NotFoundException('Task with Id '+id+' no found');
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    async createTask(request: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(request);
    }
}
