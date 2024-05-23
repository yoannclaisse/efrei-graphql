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
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  @ResolveField(() => User)
  async user(@Root() todo: Todo): Promise<User | null> {
    return this.prismaService.todo.findUnique({
      where: {
        id: todo.id,
      },
    }).user();
  }

  @Query(() => Todo, { nullable: true })
  async todoById(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.todo.findUnique({
      where: { id },
    });
  }

  // @Query(() => [Todo])
  // async todos(
  //   @Args('searchString', { nullable: true }) searchString?: string,
  //   @Args('skip', { nullable: true, type: () => Int }) skip?: number,
  //   @Args('take', { nullable: true, type: () => Int }) take?: number,
  //   @Args('orderBy', { nullable: true }) orderBy?: any,
  // ): Promise<Todo[]> {
  //   const or = searchString
  //     ? {
  //         OR: [
  //           { title: { contains: searchString } },
  //           { description: { contains: searchString } },
  //         ],
  //       }
  //     : {};

  //   return this.prismaService.todo.findMany({
  //     where: {
  //       ...or,
  //     },
  //     take: take || undefined,
  //     skip: skip || undefined,
  //     orderBy: orderBy || undefined,
  //   });
  // }

  // @Mutation(() => Todo)
  // async createTodo(
  //   @Args('data') data: TodoCreateInput,
  //   @Args('userId', { type: () => Int }) userId: number,
  // ): Promise<Todo> {
  //   return this.prismaService.todo.create({
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       user: {
  //         connect: { id: userId },
  //       },
  //     },
  //   });
  // }

  // @Mutation(() => Todo)
  // async updateTodoCompletion(
  //   @Args('id', { type: () => Int }) id: number,
  //   @Args('completed', { type: () => Boolean }) completed: boolean,
  // ): Promise<Todo> {
  //   return this.prismaService.todo.update({
  //     where: { id },
  //     data: {
  //       completed,
  //     },
  //   });
  // }

  // @Mutation(() => Todo, { nullable: true })
  // async deleteTodo(
  //   @Args('id', { type: () => Int }) id: number,
  // ): Promise<Todo | null> {
  //   return this.prismaService.todo.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }
}
