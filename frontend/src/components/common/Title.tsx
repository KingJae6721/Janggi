import { COLORS } from '../../constants/colors';
import './Title.css';

const Title = () => {
  return (
    <div className='title-container'>
      <h1 style={{ color: COLORS.ui.text }}>장기 (Janggi)</h1>
      <h3 style={{ color: COLORS.ui.textSecondary }}>Korean Chess</h3>
    </div>
  );
};

export default Title;
