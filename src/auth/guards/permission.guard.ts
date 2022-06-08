// import { PermissionEnum } from 'src/permission/enum/permission-enum';
// import { PrismaService } from 'src/prisma/prisma.service';

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { User } from '@prisma/client';

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private prismaService: PrismaService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requirePermission = this.reflector.getAllAndOverride<
//       PermissionEnum[]
//     >('permission', [context.getHandler()]);

//     const user: User = context.switchToHttp().getRequest().user;
//     const permissions = await this.prismaService.role_Permissions.findMany({
//       where: { roleId: user.roleId },
//       include: { permission: true },
//     });
    
//     const permissionCodes = permissions.map((v) => v.permission.name.toUpperCase().split('-').join('_'));
//     console.log(permissionCodes);

//     if (!requirePermission) return true;

//     return requirePermission.some((permission) => permissionCodes.includes(permission));
//   }
// }
