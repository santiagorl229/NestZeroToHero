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

@Controller('tasks')
@UseGuards(AuthGuard())

export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
      return this.tasksService.createTask(createTaskDto);
    }
      
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.tasksService.deleteTask(id);
    } 

    @Patch('/:id/status')
    updateTaskStatus(
    @Param('id', ParseIntPipe) id: number, @Body('status', new TaskStatusValidationPipe) status: TaskStatus): Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status);          
    }

}



