import { FC, memo } from 'react';
import './styles.scss';
import useDateTimeHelper from 'hooks/useDateTimeHelper';

interface Props {
  date: string;
}

const CalendarRowHeader: FC<Props> = ({ date }) => {
  const { getUtcDayFromDate, getShortWeekDayFromDate } = useDateTimeHelper();
  return (
    <>
      <div className="calendar-row-header flex column items-center justify-center">
        <div className="text-md mb-xs text-bold">{getUtcDayFromDate(date)}</div>
        <div className="text-xs">{getShortWeekDayFromDate(date)}</div>
      </div>

      <div className="calendar-row-header--empty"></div>
    </>
  );
};

export default memo(CalendarRowHeader);
