import './styles.scss';

const CalendarLoader = () => {
  return (
    <div className="calendar-loader">
      <div className="calendar-loader__inner">
        <div className="calendar-loader__content">
          <span className="calendar-loader__spinner"></span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLoader;
