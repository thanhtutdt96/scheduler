import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@air/react-drag-to-select';
import CalendarCellItem from 'components/Calendar/CalendarCellItem';
import CalendarDragSelect from 'components/Calendar/CalendarDragSelect';
import CalendarHeader from 'components/Calendar/CalendarHeader';
import CalendarItem from 'components/Calendar/CalendarItem';
import CalendarItemForm from 'components/Calendar/CalendarItemForm';
import CalendarWrapper from 'components/Calendar/CalendarWrapper';
import Modal from 'components/Common/Modal';
import { findKey, findLastKey, maxBy, mergeWith, minBy } from 'lodash-es';
import {
  useGetAvailableItemsQuery,
  useGetScheduledItemsQuery,
  useGetWorkingTimesQuery,
} from 'redux/services/schedulerApi';
import useCalendar from 'hooks/useCalendar';
import useDateTimeHelper from 'hooks/useDateTimeHelper';
import useDeepCompareCallback from 'hooks/useDeepCompareCallback';
import useDeepCompareMemo from 'hooks/useDeepCompareMemo';
import useModal from 'hooks/useModal';
import {
  CalendarItemType,
  SelectedTimeItem,
  TimeItem,
  TimeItemOverlappedType,
} from 'types/Calendar';

const Calendar = () => {
  const { isShowing, toggleModal } = useModal();
  const {
    startTimeNumber,
    endTimeNumber,
    addDay,
    getCalendarDates,
    subtractDate,
    getTimeItems,
    getShortWeekDayFromDate,
    getDisplayTime,
  } = useDateTimeHelper();
  const { mergeCalendarCallback } = useCalendar();

  const { data: workingTimes, isFetching: isLoadingWorkingTimes } = useGetWorkingTimesQuery();
  const { data: scheduledCalendar, isFetching: isLoadingScheduledCalendar } =
    useGetScheduledItemsQuery();
  const { data: additionalAvailableItems, isFetching: isLoadingAvailableItems } =
    useGetAvailableItemsQuery();

  const selectableItems = useRef<Box[]>([]);
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Get the mapping rect of calendar items using for drag select
    if (calendarWrapperRef.current) {
      const calendarCellItems = calendarWrapperRef.current?.querySelectorAll('.calendar-cell-item');

      Array.from(calendarCellItems).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height,
        });
      });
    }
  }, []);

  const [startDate, setStartDate] = useState('2022-05-24');
  const [selectedTimeItem, setSelectedTimeItem] = useState<SelectedTimeItem>();

  const isLoadingData = useMemo(
    () => isLoadingWorkingTimes || isLoadingWorkingTimes || isLoadingAvailableItems,
    [isLoadingAvailableItems, isLoadingWorkingTimes],
  );

  const calendar = useDeepCompareMemo(() => {
    const dates = getCalendarDates(startDate);
    const timeItems = getTimeItems(startTimeNumber, endTimeNumber);

    let count = 0;

    return dates.reduce((accumulative: Record<string, TimeItem[]>, date) => {
      accumulative[date] = timeItems.map((item) => {
        const result = { ...item, order: count };
        count++;
        return result;
      });

      return accumulative;
    }, {});
  }, [endTimeNumber, getCalendarDates, getTimeItems, startDate, startTimeNumber]);

  // Sorted the time items in scheduled calendar, based on startTime ascending
  const sortedScheduledCalendar = useDeepCompareMemo(() => {
    if (!scheduledCalendar) {
      return {};
    }

    return Object.keys(scheduledCalendar)?.reduce(
      (accumulative: Record<string, TimeItem[]>, date) => {
        accumulative[date] = [...scheduledCalendar[date]].sort(
          ({ startTime: currentStartTime }, { startTime: nextStartTime }) =>
            parseInt(currentStartTime) - parseInt(nextStartTime),
        );
        return accumulative;
      },
      {},
    );
  }, [scheduledCalendar]);

  const availableCalendar = useDeepCompareMemo(() => {
    // Merge the calculated available time items with user added available items
    return mergeWith(
      {},
      Object.keys(calendar)?.reduce((accumulative: Record<string, TimeItem[]>, date) => {
        const scheduledItems = sortedScheduledCalendar[date];
        const shortDay = getShortWeekDayFromDate(date);
        const availableItems: TimeItem[] = [];

        if (!workingTimes) {
          return accumulative;
        }

        const { startTime, endTime } = workingTimes[shortDay];

        if (!scheduledItems) {
          availableItems.push({ startTime, endTime });
          accumulative[date] = availableItems;

          return accumulative;
        }

        if (scheduledItems.length > 0) {
          scheduledItems.forEach(
            ({ startTime: itemStartTime, endTime: itemEndTime }, index, array) => {
              if (index === 0 && startTime < itemStartTime) {
                availableItems.push({ startTime, endTime: itemStartTime });
              }

              if (index === array.length - 1 && endTime > itemEndTime) {
                availableItems.push({ startTime: itemEndTime, endTime });
              }

              if (index > 0 && itemStartTime > array[index - 1]?.endTime) {
                availableItems.push({
                  startTime: array[index - 1]?.endTime,
                  endTime: itemStartTime,
                });
              }
            },
          );
          accumulative[date] = availableItems;

          return accumulative;
        }

        return accumulative;
      }, {}),
      additionalAvailableItems,
      mergeCalendarCallback,
    );
  }, [
    additionalAvailableItems,
    calendar,
    getShortWeekDayFromDate,
    mergeCalendarCallback,
    sortedScheduledCalendar,
    workingTimes,
  ]);

  // Find the start index of time item, for rendering the time block
  const findStartTimeIndex = (times: TimeItem[], itemStartTime: string) => {
    return times.findIndex(({ startTime }) => startTime === itemStartTime);
  };

  // Find the end index of time item, for rendering the time block
  const findEndTimeIndex = (times: TimeItem[], itemEndTime: string) => {
    return times.findIndex(({ endTime }) => endTime === itemEndTime);
  };

  const checkItemOverlapped = (previousItem: TimeItem, currentItem: TimeItem) => {
    if (!previousItem) {
      return TimeItemOverlappedType.NO_OVERLAPPED;
    }

    if (
      previousItem.endTime > currentItem.startTime &&
      previousItem.endTime >= currentItem.endTime
    ) {
      return TimeItemOverlappedType.FULL_OVERLAPPED;
    }

    if (
      (previousItem.endTime > currentItem.startTime &&
        previousItem.endTime < currentItem.endTime) ||
      (previousItem.startTime < currentItem.endTime && previousItem.endTime > currentItem.endTime)
    ) {
      return TimeItemOverlappedType.PARTIAL_OVERLAPPED;
    }

    return TimeItemOverlappedType.NO_OVERLAPPED;
  };

  const checkConsecutiveItemsBlock = useDeepCompareCallback(
    (calendarType: CalendarItemType, date: string, currentItem: TimeItem) => {
      const currentCalendar =
        calendarType === CalendarItemType.SCHEDULED ? sortedScheduledCalendar : availableCalendar;
      const previousDateItems = currentCalendar[subtractDate(date, 1)];
      const nextDateItems = currentCalendar[addDay(date, 1)];

      if (!previousDateItems && !nextDateItems) {
        return false;
      }

      const previousFoundItem = previousDateItems?.find(
        ({ startTime }) => startTime === currentItem.startTime,
      );

      const nextFoundItem = nextDateItems?.find(
        ({ startTime }) => startTime === currentItem.startTime,
      );

      if (!previousFoundItem && !nextFoundItem) {
        return false;
      }

      return (
        previousFoundItem?.endTime === currentItem.endTime ||
        nextFoundItem?.endTime === currentItem.endTime
      );
    },
    [addDay, availableCalendar, sortedScheduledCalendar, subtractDate],
  );

  const cellItemClickHandler = (date: string, { startTime, endTime, name }: TimeItem) => {
    setSelectedTimeItem({ startDate: date, endDate: date, startTime, endTime, name });
    toggleModal(true);
  };

  const multipleCellItemSelectHandler = (values: number[]) => {
    const selectedCalendarItems = Object.keys(calendar).reduce(
      (accumulative: Record<string, TimeItem[]>, date) => {
        const filteredTimeItems = calendar[date].filter((timeItem) => {
          if (!timeItem.order) {
            return false;
          }

          return values.includes(timeItem.order);
        });

        if (filteredTimeItems?.length > 0) {
          accumulative[date] = filteredTimeItems;
        }

        return accumulative;
      },
      {},
    );

    const startDate = findKey(selectedCalendarItems);
    const endDate = findLastKey(selectedCalendarItems);
    const startTime = minBy(selectedCalendarItems[startDate || ''], 'startTime')?.startTime;
    const endTime = maxBy(selectedCalendarItems[endDate || ''], 'endTime')?.endTime;

    if (startDate && endDate && startTime && endTime) {
      setSelectedTimeItem({ startDate, endDate, startTime, endTime });
      toggleModal(true);
    }
  };

  return (
    <div className="calendar">
      <CalendarHeader startDate={startDate} setStartDate={setStartDate} />

      <CalendarWrapper ref={calendarWrapperRef} calendar={calendar} isLoading={isLoadingData}>
        {({ date }) => (
          <div className="relative">
            <CalendarDragSelect
              selectableItems={selectableItems}
              handleSelectionEnd={(values) => multipleCellItemSelectHandler(values)}
            />
            <div className="calendar__column-wrapper" data-disableselect={false}>
              {calendar?.[date]?.map((item, itemIndex) => (
                <CalendarCellItem
                  key={itemIndex}
                  onClickHandler={() => cellItemClickHandler(date, item)}
                />
              ))}
            </div>
            {!isLoadingScheduledCalendar &&
              sortedScheduledCalendar?.[date]?.map((item, itemIndex, array) => (
                <CalendarItem
                  key={itemIndex}
                  startIndex={findStartTimeIndex(calendar[date], item.startTime)}
                  endIndex={findEndTimeIndex(calendar[date], item.endTime)}
                  name={item.name}
                  time={`${getDisplayTime(item.startTime, 'h:mma')} - ${getDisplayTime(
                    item.endTime,
                    'h:mma',
                  )}`}
                  itemIndex={itemIndex}
                  overlappedType={checkItemOverlapped(array[itemIndex - 1], item)}
                  isConsecutiveBlock={checkConsecutiveItemsBlock(
                    CalendarItemType.SCHEDULED,
                    date,
                    item,
                  )}
                  type={CalendarItemType.SCHEDULED}
                />
              ))}
            {!isLoadingData &&
              availableCalendar?.[date]?.map((item, itemIndex, array) => (
                <CalendarItem
                  key={itemIndex}
                  startIndex={findStartTimeIndex(calendar[date], item.startTime)}
                  endIndex={findEndTimeIndex(calendar[date], item.endTime)}
                  time={`${getDisplayTime(item.startTime, 'h:mma')} - ${getDisplayTime(
                    item.endTime,
                    'h:mma',
                  )}`}
                  itemIndex={itemIndex}
                  overlappedType={checkItemOverlapped(array[itemIndex - 1], item)}
                  isConsecutiveBlock={checkConsecutiveItemsBlock(
                    CalendarItemType.AVAILABLE,
                    date,
                    item,
                  )}
                  type={CalendarItemType.AVAILABLE}
                />
              ))}
          </div>
        )}
      </CalendarWrapper>

      <Modal isShowing={isShowing} hideModal={toggleModal} header={selectedTimeItem?.name}>
        <CalendarItemForm
          selectedTimeItem={selectedTimeItem}
          hideModal={toggleModal}
          additionalAvailableItems={additionalAvailableItems}
          setSelectedTimeItem={setSelectedTimeItem}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
