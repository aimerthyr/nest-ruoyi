import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // token 默认是 1 天时间
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, JwtStrategy],
  exports: [PermissionService],
})
export class PermissionModule {}
