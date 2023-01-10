import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggleModal(value?: boolean) {
    setIsShowing(value === undefined ? !isShowing : value);
  }

  return {
    isShowing,
    toggleModal,
  };
};

export default useModal;
