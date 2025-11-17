// game.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Move } from './move.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Move])], // 여기서 등록해야 Repository 주입 가능
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
