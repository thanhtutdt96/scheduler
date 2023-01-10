import { useOutlet } from 'react-router';

const MainLayout = () => {
  const currentOutlet = useOutlet();

  return <div className="App">{currentOutlet}</div>;
};

export default MainLayout;
