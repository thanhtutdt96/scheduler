import { FC, memo } from 'react';
import './styles.scss';
import useDateTimeHelper from 'hooks/useDateTimeHelper';

interface Props {
  timeArray: string[];
}

const CalendarColumnHeader: FC<Props> = ({ timeArray }) => {
  const { getDisplayTime } = useDateTimeHelper();
  return (
    <div className="px-sm">
      <div className="calendar-column-header__item--empty" />
      {timeArray?.map((time, index) => (
        <div
          key={index}
          className={`text-xs calendar-column-header__item${
            index === 0 ? ' calendar-column-header__item--first' : ''
          }`}
        >
          {getDisplayTime(time)}
        </div>
      ))}
    </div>
  );
};

export default memo(CalendarColumnHeader);
