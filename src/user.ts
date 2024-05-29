import 'reflect-metadata';
import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Todo } from './todo';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  @IsEmail()
  email?: string;

  @HideField()
  password?: string;

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[] | null;
}