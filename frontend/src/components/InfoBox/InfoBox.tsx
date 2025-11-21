import './InfoBox.css';

type InfoBoxProps = {
  children: React.ReactNode;
};

export const InfoBox = ({ children }: InfoBoxProps) => {
  return <section className='info-box'>{children}</section>;
};
