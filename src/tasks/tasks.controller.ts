import { Delete, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { identity } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())

export class TasksController {
    private logger = new Logger('TasksController')
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]>{
        this.logger.verbose(`User "${user.username}" retrieving a task. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task>{
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task>{
           this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
           return this.tasksService.createTask(createTaskDto, user);
    }
      
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    ): Promise<void>{
        return this.tasksService.deleteTask(id, user);
    } 

    @Patch('/:id/status')
    updateTaskStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body('status', new TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
    ): Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status, user);          
    }

}



