import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Entity, ObjectId, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, BeforeInsert } from 'typeorm';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { hashSync, compareSync } from 'bcrypt';

export enum Status {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
}

export enum Role {
	CLIENT = 'client',
	ADMIN = 'admin',
}


registerEnumType(Status, {
	name: 'Status',
	description: 'Possible statuses',
});


registerEnumType(Role, {
	name: 'Role',
	description: 'Possible Role',
});

@Entity()
@ObjectType()
export class User {

	@ObjectIdColumn()
	@Field(() => String)
	_id: ObjectId;


	@Column()
	@Field({ nullable: true })
	@IsNotEmpty()
	firstName: string;

	@Column()
	@Field({ nullable: true })
	@IsNotEmpty()
	lastName: string;

	@Column()
	@Field({ nullable: true })
	@IsNotEmpty()
	userName: string;

	@Column()
	@Field({ nullable: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@Column()
	@Field({ nullable: true })
	@IsOptional()
	profileImage: string;

	@Column()
	@Field({ nullable: true })
	@IsNotEmpty()
	password: string;



	@Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
	@Field(() => Status)
	@IsOptional()
	status: Status;

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})

	@Field(() => Date)
	createdAt: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP'
	})

	@Field(() => Date)
	updatedAt: Date;

	@Column({ type: 'enum', enum: Role, default: Role.CLIENT })
	@Field(() => Role)
	@IsOptional()
	role: Role;

	@BeforeInsert()
	private async hashPassword(): Promise<void> {
		this.password = await hashSync(this.password, 10);
	}

	verifyPassword(password: string): boolean {
		return compareSync(password, this.password);
	}
}
