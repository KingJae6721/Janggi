export const COLORS = {
  background: '#FFF8DC', // 부드러운 크림색 배경

  team: {
    han: '#DC143C', // 선명한 빨간색 (한 진영)
    cho: '#2E8B57', // 차분한 초록색 (초 진영)
  },

  board: {
    background: '#DEB887', // 따뜻한 베이지 (나무판 느낌)
    border: '#8B4513', // 진한 갈색 테두리
    line: '#A0826D', // 은은한 갈색 선
    highlight: '#FFE4B5', // 선택/강조 시 밝은 색
  },

  piece: {
    han: '#B22222', // 깊은 빨간색 (한 기물)
    cho: '#228B22', // 깊은 초록색 (초 기물)
    shadow: 'rgba(0, 0, 0, 0.2)', // 기물 그림자
  },

  ui: {
    border: '#D2B48C', // 박스 테두리
    text: '#563732ff', // 주요 텍스트
    textSecondary: '#835a4dff', // 보조 텍스트
  },

  // 버튼
  button: {
    primary: {
      background: '#8B4513', // 진한 갈색 (장기판 테두리와 매칭)
      text: '#FFF8DC', // 크림색 텍스트
      hover: '#A0522D', // 호버 시 밝은 갈색
      active: '#6B3410', // 클릭 시 더 어두운 갈색
    },
    secondary: {
      background: '#D2B48C', // 밝은 갈색
      text: '#3E2723', // 진한 텍스트
      hover: '#C9A66B', // 호버 시 약간 어두운 갈색
      active: '#B8956A', // 클릭 시 더 어두운 갈색
    },
    disabled: {
      background: '#E8D4B8', // 비활성화 배경
      text: '#9E9E9E', // 회색 텍스트
    },
  },

  // 입력 박스
  input: {
    background: '#FFFAF0', // 밝은 아이보리 (배경보다 살짝 밝음)
    border: '#D2B48C', // 테두리 (UI 테두리와 동일)
    borderFocus: '#8B4513', // 포커스 시 진한 갈색
    text: '#3E2723', // 입력 텍스트
    placeholder: '#A89F91', // placeholder 텍스트
    disabled: '#F5F5DC', // 비활성화 배경
  },
} as const;

export type TeamColor = 'han' | 'cho';

// 사용예시
/*
import { COLORS } from '@/constants/colors';

// 배경색
style={{ backgroundColor: COLORS.background }}

// 한 진영
style={{ color: COLORS.team.han }}

// 장기판
style={{ 
  backgroundColor: COLORS.board.background,
  border: `2px solid ${COLORS.board.border}`
}}
  // Primary 버튼
style={{ 
  backgroundColor: COLORS.button.primary.background,
  color: COLORS.button.primary.text 
}}

// Input 박스
style={{ 
  backgroundColor: COLORS.input.background,
  border: `1px solid ${COLORS.input.border}`,
  color: COLORS.input.text
}}
*/
