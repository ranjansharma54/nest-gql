import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
	imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
	providers: [UsersResolver, UsersService,],
})
export class UsersModule { }
