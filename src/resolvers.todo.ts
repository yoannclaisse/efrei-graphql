import { Resolver, Query, Mutation, Args, ResolveField, Root, InputType, Field, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Todo } from './todo';
import { User } from './user';
import { PrismaService } from './prisma.service';

@InputType()
export class TodoCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

@Resolver(Todo)
export class TodoResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  // @ResolveField(() => User)
  // async user(@Root() todo: Todo): Promise<User | null> {
  //   return this.prismaService.todo.findUnique({
  //     where: {
  //       id: todo.id,
  //     },
  //   }).user();
  // }

  // @Query(() => Todo, { nullable: true })
  // async todoById(@Args('id', { type: () => Int }) id: number) {
  //   return this.prismaService.todo.findUnique({
  //     where: { id },
  //   });
  // }

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
}
