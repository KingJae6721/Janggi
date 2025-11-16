import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameController } from './game/game.cotroller';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController, GameController], // GameController 추가
  providers: [AppService, GameService], // GameService 추가
})
export class AppModule {}
