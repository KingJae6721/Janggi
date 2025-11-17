import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Move } from './move.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1: string;

  @Column()
  player2: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @OneToMany(() => Move, (move) => move.game)
  moves: Move[];
}
