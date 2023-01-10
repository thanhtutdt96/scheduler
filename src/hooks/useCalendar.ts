import { isArray } from 'lodash-es';
import { TimeItem } from 'types/Calendar';

const useCalendar = () => {
  const mergeCalendarCallback = (
    objValue: Record<string, unknown> | TimeItem[],
    srcValue: TimeItem[],
  ) => {
    if (isArray(objValue)) {
      return objValue
        .concat(srcValue)
        .sort(
          ({ startTime: currentStartTime }, { startTime: nextStartTime }) =>
            parseInt(currentStartTime) - parseInt(nextStartTime),
        );
    }
  };

  return {
    mergeCalendarCallback,
  };
};

export default useCalendar;
