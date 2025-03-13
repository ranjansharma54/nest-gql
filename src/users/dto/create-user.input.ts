import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Status, Role } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
	@Field({ nullable: false })
	@IsNotEmpty()
	firstName: string;

	@Field({ nullable: false })
	@IsNotEmpty()
	lastName: string;

	@Field({ nullable: false })
	@IsNotEmpty()
	userName: string;

	@Field({ nullable: false })
	@IsNotEmpty()
	@IsEmail()
	email: string;


	@Field()
	@IsNotEmpty()
	password: string;

	@Field(() => Status, { defaultValue: Status.ACTIVE })
	@IsOptional()
	status: Status = Status.ACTIVE;


	@Field(() => Role, { defaultValue: Role.CLIENT })
	@IsOptional()
	role: Role = Role.CLIENT;


	@Field({ nullable: true })
	@IsOptional()
	profileImage: string;
}



@InputType()
export class UserLogin {
	@Field({ nullable: false })
	@IsNotEmpty()
	@IsEmail()
	email: string;


	@Field()
	@IsNotEmpty()
	password: string;

}
