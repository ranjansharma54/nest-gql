import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserOutput } from './dto/user.output';
import { CreateUserInput, UserLogin } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { RolesGuard } from 'src/gaurds/roles.gaurds';
import { Roles } from 'src/gaurds/roles.decorator';
import { Role } from './entities/user.entity';
import { GqlAuthGuard } from 'src/gaurds/gql.guard';
import GraphQLJSON from 'graphql-type-json';
import { ObjectId } from 'mongodb';



@Resolver(() => UserOutput)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) { }

	@Query(() => GraphQLJSON, { name: 'login' })
	login(@Args('UserLogin') userLogin: UserLogin) {
		return this.usersService.getAuthLogin(userLogin);
	}

	@Query(() => [UserOutput], { name: 'users' })
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	findAll() {
		return this.usersService.findAll();
	}

	@Query(() => UserOutput, { name: 'user' })
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	findOne(@Args('id', { type: () => Int }) id: ObjectId) {
		return this.usersService.findOne(id);
	}

	@Mutation(() => UserOutput)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.usersService.create(createUserInput);
	}

	@Mutation(() => UserOutput)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.usersService.update(updateUserInput.id, updateUserInput);
	}

	@Mutation(() => UserOutput)
	@UseGuards(GqlAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	removeUser(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.remove(id);
	}
}
