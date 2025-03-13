import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput, UserLogin } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';



interface TokenPayload {
	userId: string;
}


@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private jwtTokenService: JwtService
	) { }


	generateToken(payload: TokenPayload) {
		return this.jwtTokenService.sign(payload);
	}

	verfiyToken = async (token: string, key: string) => {
		return await this.jwtTokenService.verify(token, { secret: key });
	};

	async getTokens(data: any) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtTokenService.signAsync(data, {
				secret: process.env.jwtAccessSecret,
				expiresIn: '7d',
			}),
			this.jwtTokenService.signAsync(data, {
				secret: process.env.jwtRefreshSecret,
				expiresIn: '7d',
			}),
		]);

		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
		};
	}

	async getResetTokens(data: any) {
		const [accessToken] = await Promise.all([
			this.jwtTokenService.signAsync(data, {
				secret: process.env.jwtAccessSecret,
				expiresIn: '60m',
			}),

		]);

		return {
			accessToken: accessToken,
		};
	}


	async create(createUserInput: CreateUserInput): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { email: createUserInput.email },
		});

		if (existingUser) {
			throw new HttpException(
				`User with email ${createUserInput.email} already exists.`,
				HttpStatus.BAD_REQUEST,
			);
		}

		const user = this.userRepository.create(createUserInput);
		return await this.userRepository.save(user);
	}


	async getAuthLogin(userLogin: UserLogin): Promise<any> {
		try {
			const { email, password } = userLogin;

			const user = await this.userRepository.findOne({ where: { email } });
			if (!user) {
				return {
					status: 404,
					message: 'User with this email not found.',
					error: true,
				};
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) {
				return {
					status: 302,
					message: 'User with this email and password not found.',
					error: true,
				};
			}

			if (user.status === 'inactive') {
				return {
					status: 302,
					message: 'User is either not active or not verified. Please contact support.',
					error: true,
				};
			}

			if (user.status === 'active') {
				const userPayload = {
					firstName: user?.firstName,
					lastName: user?.lastName,
					status: user?.status,
					_id: user?._id,
					role: user?.role,
				};
				const tokens = await this.getTokens(userPayload);

				const usersDetails = {
					firstName: user?.firstName,
					lastName: user?.lastName,
					status: user?.status,
					_id: user?._id,
					role: user?.role,
				};


				return {
					status: 201,
					message: 'User login successful.',
					data: {
						user: usersDetails,
						tokens,
					},
				};
			}
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}


	async findAll() {
		const users = await this.userRepository.find({});
		return users;
	}

	async findOne(id: ObjectId) {
		const user = await this.userRepository.findOne({ where: { _id: new ObjectId(id)} });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				error: true,
			};
		}
		return user;
	}

	async update(id: number, updateUserInput: UpdateUserInput) {
		return `This action updates a #${id} user`;
	}

	async remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
