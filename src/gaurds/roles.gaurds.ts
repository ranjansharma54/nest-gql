import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
		private reflector: Reflector,
		private readonly usersService: UsersService
	) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const { user } = ctx.getContext().req;
		const usersDetails = await this.usersService.findOne(user?._id)
		if(!usersDetails || 'error' in usersDetails){
			return false
		}
        return requiredRoles.some((role) => usersDetails?.role?.includes(role));
    }
}
