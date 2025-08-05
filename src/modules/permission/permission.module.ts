import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
