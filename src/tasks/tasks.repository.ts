import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
private logger = new Logger('TasksRepository');

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>
    {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');
        query.where({user});
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere(
                '(task.title ILIKE :search OR task.description ILIKE :search)',
                {search: `%${search}%`}
            );
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        }
        catch (error){
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }    
    async createTask(request: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = request;
        const task = this.create(
        {
            title,
            description,
            status: TaskStatus.OPEN,
            user,
        });
        await this.save(task);
        return task;
    }
}