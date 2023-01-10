import { lazy } from 'react';
import Calendar from 'components/Calendar';

const Toast = lazy(() => import('components/Common/Toast'));

const Home = () => {
  return (
    <>
      <h2 className="text-center">Scheduler</h2>
      <div className="container">
        <Calendar />
      </div>
      <Toast />
    </>
  );
};

export default Home;
