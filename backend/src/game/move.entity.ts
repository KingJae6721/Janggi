import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Game } from './game.entity';

@Entity('moves')
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, (game) => game.moves)
  game: Game;

  @Column()
  turn: number; // 몇 번째 수인지

  @Column()
  piece: string; // 기물 종류 (예: '차', '마')

  @Column()
  fromX: number;

  @Column()
  fromY: number;

  @Column()
  toX: number;

  @Column()
  toY: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
