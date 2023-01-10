import { memo } from 'react';
import { CalendarItemColorType, CalendarItemType } from 'types/Calendar';
import './styles.scss';

const CalendarLegend = () => {
  const legendData = [
    {
      name: CalendarItemType.AVAILABLE,
      color: CalendarItemColorType.SECONDARY,
    },
    {
      name: CalendarItemType.CONSECUTIVE_AVAILABLE,
      color: CalendarItemColorType.CONSECUTIVE_SECONDARY,
    },
    {
      name: CalendarItemType.SCHEDULED,
      color: CalendarItemColorType.NEGATIVE,
    },
    {
      name: CalendarItemType.CONSECUTIVE_SCHEDULED,
      color: CalendarItemColorType.CONSECUTIVE_NEGATIVE,
    },
    {
      name: CalendarItemType.OTHER,
      color: CalendarItemColorType.OTHER,
    },
  ];

  return (
    <div className="mb-sm">
      <h5 className="mt-0 mb-xs">Time block</h5>
      <div className="flex column">
        {legendData.map(({ name, color }, index) => (
          <div key={index} className="flex items-center calendar-legend__item mb-xs">
            <div
              style={{
                backgroundColor: `var(--color-${color})`,
                ...(color === CalendarItemColorType.OTHER ? { border: '2px solid #ccc' } : {}),
              }}
              className="calendar-legend__color mr-sm"
            ></div>
            <p className="ma-0 text-sm">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarLegend);
