import { Dispatch, FC, memo, SetStateAction } from 'react';
import CalendarLegend from 'components/Calendar/CalendarLegend';

interface Props {
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
}

const CalendarHeader: FC<Props> = ({ startDate, setStartDate }) => (
  <div className="flex justify-between items-center">
    <CalendarLegend />
    <div className="flex mb-md text-sm items-center">
      <label htmlFor="start_date" className="mr-sm">
        Start Date
      </label>
      <input
        type="date"
        value={startDate}
        onChange={(event) => setStartDate(event.target?.value as string)}
        name="start_date"
      />
    </div>
  </div>
);

export default memo(CalendarHeader);
