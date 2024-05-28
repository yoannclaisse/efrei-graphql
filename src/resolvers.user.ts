import { Resolver, Query, Mutation, Args, Context, ResolveField, Root, InputType, Field, Int } from '@nestjs/graphql';
import { ConflictException, Inject } from '@nestjs/common';
import { User } from './user';
import { PrismaService } from './prisma.service';
import { Todo } from './todo';
// import { TodoCreateInput } from './resolvers.todo';
import { sha256 } from 'js-sha256';

@InputType()
class UserUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;
}

@InputType()
class UserCreateInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  username: string;

  @Field()
  password: string;

  // @Field(() => [TodoCreateInput], { nullable: true })
  // todos: Todo[];
}

@InputType()
class UserUpdateInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  // QUERIES USER

  // Get all users
  @Query(() => [User], { nullable: true })
  async allUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  // userExists
  @Query(() => Number, { nullable: true })
  async userExists(
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string
  ): Promise<Number> {
    return this.prismaService.user.count({
      where: {
        username: username,
        password: sha256(password)
      }
    })
  }


  // Get user by id
  @Query(() => User, { nullable: true })
  async userById(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  // get user by id and todos 
  @Query(() => User, { nullable: true })
  async userWithTodosById(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        // Include todos in the response
        todos: true,
      },
    });

    if (!user) return null;

    // Map todos to include the user property
    const todosWithUser = user.todos.map(todo => ({
      ...todo,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }));

    return {
      ...user,
      todos: todosWithUser,
    };
  }

  // MUTATIONS

  // Delete user and todos
  @Mutation(() => User, { nullable: true })
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    // Supprimer toutes les Todos associées à l'utilisateur
    await this.prismaService.todo.deleteMany({
      where: {
        userId: id,
      },
    });

    // Supprimer l'utilisateur lui-même
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  // Add user
  // @Mutation(() => User)
  // async addUser(@Args('data') data: UserCreateInput): Promise<User> {
  //   const hashedPassword = sha256(data.password)
  //   return this.prismaService.user.create({
  //     data: {
  //       username: data.username,
  //       email: data.email,
  //       password: hashedPassword
  //     },
  //   });
  // }
  @Mutation(() => User)
  async addUser(@Args('data') data: UserCreateInput): Promise<User> {
    // Vérifier si un utilisateur avec le même username existe déjà
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      // Si un utilisateur avec le même username existe, lancer une exception
      throw new ConflictException('Username already taken');
    }

    // Hacher le mot de passe
    const hashedPassword = sha256(data.password).toString();

    // Créer un nouvel utilisateur
    return this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }


  // Update user
  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UserUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: {
        username: data.username,
        email: data.email,
      },
    });
  }
}