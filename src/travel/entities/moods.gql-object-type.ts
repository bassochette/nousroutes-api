import { Field, Int, ObjectType } from '@nestjs/graphql';

/*
  not the best solution should be in a specific table
  did that as a draft and i'm busy and running out of time...
 */
@ObjectType()
export class Moods {
  @Field(() => Int)
  nature: number;

  @Field(() => Int)
  relax: number;

  @Field(() => Int)
  history: number;

  @Field(() => Int)
  culture: number;

  @Field(() => Int)
  party: number;
}
