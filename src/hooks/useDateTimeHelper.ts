import { addDays, addMinutes, format, subDays } from 'date-fns';

const DAY_LIMIT = 7;
const DATE_FORMAT = 'yyyy-MM-dd';
export const HOUR_FORMAT = 'HHmm';
const DISPLAY_HOUR_FORMAT = 'hh:mm a';
const CALENDAR_START_TIME = '05:00';
const CALENDAR_END_TIME = '23:00';

export const FORM_HOUR_FORMAT = 'HH:mm';

const useDateTimeHelper = () => {
  const startTimeNumber = parseInt(CALENDAR_START_TIME.split(':')?.[0]);
  const endTimeNumber = parseInt(CALENDAR_END_TIME.split(':')?.[0]);

  const getShortWeekDayFromDate = (date: string) => {
    return new Date(date)?.toLocaleString('en-us', { weekday: 'short' });
  };

  const getUtcDayFromDate = (date: string) => {
    return new Date(date).getUTCDate();
  };

  const subtractDate = (date: string, amount: number) => {
    return format(subDays(new Date(date), amount), DATE_FORMAT);
  };

  const addDay = (date: string, amount: number) => {
    return format(addDays(new Date(date), amount), DATE_FORMAT);
  };

  const getDisplayTime = (time: string, displayFormat?: string) => {
    const date = new Date();
    const timeNumber = parseInt(time) / 100;
    const minutes = timeNumber.toString().split('.')?.[1] || 0;

    date.setHours(Math.trunc(timeNumber), +minutes * 10, 0);

    return format(date, displayFormat || DISPLAY_HOUR_FORMAT);
  };

  const getSubmitTime = (time: string) => {
    return time.split(':').join('');
  };

  const getCalendarDates = (startDate: string) => {
    const dates = [];

    for (let i = 0; i < DAY_LIMIT; i++) {
      dates.push(addDay(startDate, i));
    }

    return dates;
  };

  const getTimeItems = (startTimeNumber: number, endTimeNumber: number) => {
    const timeItems = [];

    const diff = endTimeNumber - startTimeNumber;

    // each hour have 2 * 30 minutes
    const times = diff * 2;

    for (let i = 0; i < times; i++) {
      const startTime = format(
        addMinutes(new Date().setHours(startTimeNumber, 0), 30 * i),
        HOUR_FORMAT,
      );

      const endTime = format(
        addMinutes(new Date().setHours(startTimeNumber, 0), 30 * (i + 1)),
        HOUR_FORMAT,
      );

      timeItems.push({
        startTime,
        endTime,
      });
    }

    return timeItems;
  };

  return {
    startTimeNumber,
    endTimeNumber,
    getCalendarDates,
    getShortWeekDayFromDate,
    getUtcDayFromDate,
    subtractDate,
    addDay,
    getDisplayTime,
    getSubmitTime,
    getTimeItems,
  };
};

export default useDateTimeHelper;
