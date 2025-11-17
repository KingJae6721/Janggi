import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Board } from '../components/board/Board';
import { FONTS } from '../constants/fonts';
import './ComponentPreview.css';
import { InfoBox } from '../components/common/InfoBox';
import { Piece } from '../components/pieces/Piece';

export const ComponentPreview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='preview-container'>
      <h1 className='preview-title'>~ 장기 게임 컴포넌트 미리보기 ~</h1>

      {/* 색상 팔레트 */}

      <InfoBox>
        <div className='preview-section'>
          <h2>Color Palette</h2>
          <div className='color-grid'>
            <div className='color-item'>
              <div
                className='color-box'
                style={{ backgroundColor: COLORS.background }}
              />
              <p className='color-name'>배경색</p>
              <p className='color-value'>{COLORS.background}</p>
            </div>

            <div className='color-item'>
              <div
                className='color-box'
                style={{ backgroundColor: COLORS.team.han }}
              />
              <p className='color-name'>한 진영</p>
              <p className='color-value'>{COLORS.team.han}</p>
            </div>

            <div className='color-item'>
              <div
                className='color-box'
                style={{ backgroundColor: COLORS.team.cho }}
              />
              <p className='color-name'>초 진영</p>
              <p className='color-value'>{COLORS.team.cho}</p>
            </div>

            <div className='color-item'>
              <div
                className='color-box'
                style={{ backgroundColor: COLORS.board.background }}
              />
              <p className='color-name'>장기판 배경</p>
              <p className='color-value'>{COLORS.board.background}</p>
            </div>

            <div className='color-item'>
              <div
                className='color-box'
                style={{ backgroundColor: COLORS.board.border }}
              />
              <p className='color-name'>장기판 테두리</p>
              <p className='color-value'>{COLORS.board.border}</p>
            </div>
          </div>
          <br />
          <h2>Buttons</h2>
          <div className='button-showcase'>
            <Button>버튼</Button>
          </div>
          <br />
          <h2>Input Text</h2>
          <div className='input-showcase'>
            <input
              type='text'
              placeholder='플레이어 이름 입력'
              className='preview-input'
            />
          </div>
          <br />
          <h2>Modal</h2>
          <Button>모달 열기</Button>
          {isModalOpen && <Modal />}
          <br />
          <h2> Game Pieces</h2>
          <div className='piece-showcase'>
            <Piece type='왕' team='han'></Piece>
            <p style={{ color: COLORS.piece.han }}>한 진영 (빨강)</p>
            <Piece type='왕' team='cho'></Piece>
            <p style={{ color: COLORS.piece.cho }}>초 진영 (초록)</p>
          </div>
          <br />
          <h2>Game Board</h2>
          <div className='board-showcase'>
            <Board />
          </div>
        </div>
      </InfoBox>
    </div>
  );
};
