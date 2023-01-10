import { FC, memo, useMemo } from 'react';
import './styles.scss';
import { CalendarItemColorType, CalendarItemType, TimeItemOverlappedType } from 'types/Calendar';

interface Props {
  startIndex: number;
  endIndex: number;
  itemIndex: number;
  name?: string;
  time?: string;
  overlappedType: TimeItemOverlappedType;
  color?: string;
  isConsecutiveBlock?: boolean;
  type?: CalendarItemType;
}

const CalendarItem: FC<Props> = ({
  startIndex,
  endIndex,
  name,
  time,
  itemIndex,
  overlappedType,
  isConsecutiveBlock,
  type,
}) => {
  const color = useMemo(() => {
    switch (type) {
      case CalendarItemType.AVAILABLE:
        if (isConsecutiveBlock) {
          return CalendarItemColorType.CONSECUTIVE_SECONDARY;
        }

        return CalendarItemColorType.SECONDARY;
      case CalendarItemType.SCHEDULED:
        if (isConsecutiveBlock) {
          return CalendarItemColorType.CONSECUTIVE_NEGATIVE;
        }

        return CalendarItemColorType.NEGATIVE;
      default:
        return CalendarItemColorType.PRIMARY;
    }
  }, [isConsecutiveBlock, type]);

  return (
    <div
      style={{
        top: `calc(${startIndex} * var(--cell-height-rem))`,
        height: `calc(${endIndex - startIndex + 1} * var(--cell-height-rem))`,
        zIndex: itemIndex,
        backgroundColor: `var(--color-${color})`,
        ...(itemIndex > 0 && overlappedType !== TimeItemOverlappedType.NO_OVERLAPPED
          ? {
              left: `calc(${itemIndex} * 1rem)`,
              width: `calc(100% - (${itemIndex} * 1rem))`,
              border: '1px solid #fff',
            }
          : {}),
      }}
      className="calendar-item py-xs px-sm text-xxs text-medium flex justify-start column"
    >
      {name && <div className="mb-xs">{name}</div>}
      {time && <div>{time}</div>}
    </div>
  );
};

export default memo(CalendarItem);
