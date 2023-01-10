import { FC, memo, MutableRefObject, useState } from 'react';
import { Box, boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';

interface Props {
  selectableItems: MutableRefObject<Box[]>;
  handleSelectionEnd: (values: number[]) => void;
}
const CalendarDragSelect: FC<Props> = ({ selectableItems, handleSelectionEnd }) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById('root'),
    onSelectionChange: (box) => {
      const indexesToSelect: number[] = [];
      const scrollAwareBox: Box = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(scrollAwareBox, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
    },
    onSelectionEnd: () => {
      if (selectedIndexes.length > 0) {
        handleSelectionEnd(selectedIndexes);
      }
    },
    shouldStartSelecting: (target) => {
      /**
       * In this example, we're preventing users from selecting inside elements
       * that have a data-disableselect attribute on them or one of their parents
       */
      if (target instanceof HTMLElement) {
        let element = target;
        while (element.parentElement && !element.dataset.disableselect) {
          element = element.parentElement;
        }

        return element.dataset?.disableselect === 'false';
      }

      return false;
    },
  });

  return <DragSelection />;
};

export default memo(CalendarDragSelect);
