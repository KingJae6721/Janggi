import { useState } from 'react';

export const useModalManager = () => {
  const [activeModal, setActiveModal] = useState<'player' | 'game'>('player');

  const toggleModal = () => {
    setActiveModal((prev) => (prev === 'player' ? 'game' : 'player'));
  };

  const modalVariants = {
    enterRight: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exitLeft: { x: '-100%', opacity: 0 },
  };

  return {
    activeModal,
    setActiveModal,
    toggleModal,
    modalVariants,
  };
};
