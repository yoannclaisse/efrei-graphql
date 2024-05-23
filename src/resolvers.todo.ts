import { Resolver, Query, Mutation, Args, ResolveField, Root, InputType, Field, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Todo } from './todo';
import { User } from './user';
import { PrismaService } from './prisma.service';

// @InputType()
// export class TodoCreateInput {
//   @Field()
//   title: string;

//   @Field({ nullable: true })
//   description?: string;
// }

@InputType()
export class CreateTodoInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  userId: number;
}

@Resolver(Todo)
export class TodoResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  @Query(() => [Todo], { nullable: 'itemsAndList' })
  async todosByUserId(@Args('userId', { type: () => Int }) userId: number): Promise<Todo[]> {
    return this.prismaService.todo.findMany({
      where: {
        userId,
      },
      include: {
        // Include the user in the response
        user: true,
      },
    });
  }

  @Query(() => User, { nullable: true })
  async userByTodoId(@Args('todoId', { type: () => Int }) todoId: number): Promise<User | null> {
    const todo = await this.prismaService.todo.findUnique({
      where: { id: todoId },
      include: { user: true },
    });

    return todo?.user || null;
  }

  @Mutation(() => Todo)
  async createTodo(
    @Args('data') data: CreateTodoInput,
  ): Promise<Todo> {
    return this.prismaService.todo.create({
      data: {
        title: data.title,
        description: data.description,
        user: {
          connect: { id: data.userId },
        },
      },
      include: {
        user: true, // Include user in the response
      },
    });
  }

  @Mutation(() => Todo, { nullable: true })
  async deleteTodoById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Todo | null> {
    try {
      const todoToDelete = await this.prismaService.todo.findFirst({
        where: { id },
        include: { user: true }, // Charger le user associé à la todo
      });

      if (!todoToDelete) {
        throw new Error('Todo not found');
      }

      await this.prismaService.todo.delete({
        where: { id },
      });

      // Retourner la todo avec le user chargé
      return todoToDelete;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodoById(
    @Args('id', { type: () => Int }) id: number,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Todo | null> {
    try {
      const todoToUpdate = await this.prismaService.todo.findFirst({
        where: { id },
        include: { user: true },
      });

      if (!todoToUpdate) {
        throw new Error('Todo not found');
      }

      const updatedTodo = await this.prismaService.todo.update({
        where: { id },
        data: {
          title,
          description,
          updatedAt: new Date(),
        },
        include: { user: true },

      });

      return updatedTodo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
