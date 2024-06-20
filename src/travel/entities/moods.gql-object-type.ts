import { Field, Int, ObjectType } from '@nestjs/graphql';

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
