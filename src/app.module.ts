import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/admin/users/users.module';
import { RolesModule } from './modules/admin/roles/roles.module';
import { PermissionsModule } from './modules/admin/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersonasModule } from './modules/admin/personas/personas.module';
import { EntidadComercialModule } from './modules/admin/entidad-comercial/entidad-comercial.module';
import { InventarioModule } from './modules/admin/inventario/inventario.module';
import { NotaModule } from './modules/admin/nota/nota.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost'/*process.env.DB_HOST || 'postgres_nest_db'*/,
      port: 5436, // 5432 el puerto pueden cambiar
      username: 'postgres',
      password: 'admin54321',
      database: 'bd_backend_nest_docker',
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
      ],
      synchronize: false
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    PersonasModule,
    EntidadComercialModule,
    InventarioModule,
    NotaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
