import { FC, memo, MouseEventHandler } from 'react';
import './styles.scss';

interface Props {
  onClickHandler: MouseEventHandler<HTMLDivElement>;
}

const CalendarCellItem: FC<Props> = ({ onClickHandler }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div className="calendar-cell-item" onClick={onClickHandler} />
);

export default memo(CalendarCellItem);
