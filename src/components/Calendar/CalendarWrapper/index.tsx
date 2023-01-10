import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import CalendarColumnHeader from 'components/Calendar/CalendarColumnHeader';
import CalendarLoader from 'components/Calendar/CalendarLoader';
import CalendarRowHeader from 'components/Calendar/CalendarRowHeader';
import useDeepCompareMemo from 'hooks/useDeepCompareMemo';
import { TimeItem } from 'types/Calendar';
import './styles.scss';

interface Props {
  calendar: Record<string, TimeItem[]>;
  children: (value: Record<string, string>) => ReactNode;
  isLoading: boolean;
}

const CalendarWrapper: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { calendar, children, isLoading },
  ref,
) => {
  const dateArray = useDeepCompareMemo(() => Object.keys(calendar), [calendar]);

  const timeArray = useDeepCompareMemo(() => {
    return calendar?.[dateArray?.[0]]?.reduce((accumulative: string[], currentItem, index) => {
      if (index === 0) {
        accumulative.push(currentItem.startTime);
      }

      accumulative.push(currentItem.endTime);

      return accumulative;
    }, []);
  }, [calendar, dateArray]);

  return (
    <div className={`flex relative${isLoading ? ' disabled' : ''}`}>
      {isLoading && <CalendarLoader />}
      <div className="flex column">
        <CalendarColumnHeader timeArray={timeArray} />
      </div>
      <div className="calendar-wrapper" ref={ref}>
        {dateArray.map((date, index) => (
          <div key={index} className="flex column">
            <CalendarRowHeader date={date} key={index} />

            {children?.({ date })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default forwardRef(CalendarWrapper);
