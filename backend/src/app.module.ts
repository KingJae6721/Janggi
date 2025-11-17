// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'janggi',
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: true,
    }),
    GameModule, // GameModule만 import
  ],
  controllers: [AppController], // AppController만 등록
  providers: [AppService], // AppService만 등록
})
export class AppModule {}
