import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Todo } from './todo';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string | null;

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[] | null;
}