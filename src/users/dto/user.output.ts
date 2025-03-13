import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ObjectId } from 'typeorm';

@ObjectType()
export class UserOutput {

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field()
	role: string;

	@Field()
	status: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}