import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { differenceInDays, isEqual } from 'date-fns';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { mergeWith } from 'lodash-es';
import { useAppDispatch } from 'redux/hooks';
import { useCreateAvailableItemMutation } from 'redux/services/schedulerApi';
import { alert } from 'redux/slices/toastSlice';
import useCalendar from 'hooks/useCalendar';
import useDateTimeHelper, { FORM_HOUR_FORMAT } from 'hooks/useDateTimeHelper';
import { SelectedTimeItem, TimeItem } from 'types/Calendar';
import { ToastType } from 'types/Common';
import './styles.scss';

interface Props {
  additionalAvailableItems?: Record<string, TimeItem[]>;
  selectedTimeItem?: SelectedTimeItem;
  hideModal: () => void;
  setSelectedTimeItem: Dispatch<SetStateAction<SelectedTimeItem | undefined>>;
}

const FormErrorMessage = ({ children }: { children: ReactNode }) => (
  <div className="text-xs text-danger mt-xs">{children}</div>
);

const CalendarItemForm: FC<Props> = ({
  selectedTimeItem,
  hideModal,
  additionalAvailableItems,
  setSelectedTimeItem,
}) => {
  const { getDisplayTime, getSubmitTime, addDay } = useDateTimeHelper();
  const { mergeCalendarCallback } = useCalendar();
  const [createItem] = useCreateAvailableItemMutation();
  const dispatch = useAppDispatch();

  const initialValues = {
    startTime: getDisplayTime(selectedTimeItem?.startTime || '', FORM_HOUR_FORMAT),
    endTime: getDisplayTime(selectedTimeItem?.endTime || '', FORM_HOUR_FORMAT),
    startDate: selectedTimeItem?.startDate || '',
    endDate: selectedTimeItem?.endDate || '',
  };

  const validateForm = ({ startTime, endTime, startDate, endDate }: SelectedTimeItem) => {
    const errors: Record<string, string> = {};
    const startTimeMinutes = parseInt(startTime.split(':')?.[1]);
    const endTimeMinutes = parseInt(endTime.split(':')?.[1]);
    const startTimeData = parseInt(startTime.split(':').join(''));
    const endTimeData = parseInt(endTime.split(':').join(''));

    if (!startTime) {
      errors.startTime = 'Required';
    } else if (startTimeMinutes !== 0 && startTimeMinutes !== 30) {
      errors.startTime = 'Minutes only 00 or 30';
    }

    if (!endTime) {
      errors.endTime = 'Required';
    } else if (endTimeMinutes !== 0 && endTimeMinutes !== 30) {
      errors.endTime = 'Minutes only 00 or 30';
    } else if (endTimeData <= startTimeData) {
      errors.endTime = 'End time must larger than start time';
    }

    if (!startDate) {
      errors.startDate = 'Required';
    }

    if (!endDate) {
      errors.endDate = 'Required';
    } else if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      errors.endDate = 'End date cannot smaller than start date';
    }

    return errors;
  };

  const submitHandler = (
    { startTime, endTime, startDate, endDate }: SelectedTimeItem,
    { setSubmitting, resetForm }: FormikHelpers<SelectedTimeItem>,
  ) => {
    const postData: Record<string, TimeItem[]> = {};
    let mergedData: Record<string, TimeItem[]> = {};

    if (isEqual(new Date(startDate), new Date(endDate))) {
      postData[startDate] = [
        {
          startTime: getSubmitTime(startTime),
          endTime: getSubmitTime(endTime),
        },
      ];
    } else {
      const diff = differenceInDays(new Date(endDate), new Date(startDate));

      for (let i = 0; i <= diff; i++) {
        postData[addDay(startDate, i)] = [
          {
            startTime: getSubmitTime(startTime),
            endTime: getSubmitTime(endTime),
          },
        ];
      }
    }

    mergedData = mergeWith({}, additionalAvailableItems, postData, mergeCalendarCallback);

    createItem(mergedData)
      .unwrap()
      .then((fulfilled) => {
        if (!fulfilled) {
          return;
        }

        dispatch(alert('Time block created successfully', ToastType.SUCCESS));

        resetForm();
        setSelectedTimeItem(undefined);
        hideModal();
      })
      .catch((error) => {
        dispatch(alert(error?.error || 'Error', ToastType.ERROR));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={submitHandler}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="calendar-item-form__field-wrapper text-sm mb-md">
            <label htmlFor="date">Start Date</label>
            <div className="flex column">
              <Field id="startDate" name="startDate" type="date" />
              <ErrorMessage
                name="startDate"
                render={(errorMessage) => <FormErrorMessage>{errorMessage}</FormErrorMessage>}
              />
            </div>
          </div>

          <div className="calendar-item-form__field-wrapper text-sm mb-md">
            <label htmlFor="date">End Date</label>
            <div className="flex column">
              <Field id="endDate" name="endDate" type="date" />
              <ErrorMessage
                name="endDate"
                render={(errorMessage) => <FormErrorMessage>{errorMessage}</FormErrorMessage>}
              />
            </div>
          </div>

          <div className="calendar-item-form__field-wrapper text-sm mb-md">
            <label htmlFor="startTime">Start Time</label>
            <div className="flex column">
              <Field type="time" id="startTime" name="startTime" />
              <ErrorMessage
                name="startTime"
                render={(errorMessage) => <FormErrorMessage>{errorMessage}</FormErrorMessage>}
              />
            </div>
          </div>

          <div className="calendar-item-form__field-wrapper text-sm mb-lg">
            <label htmlFor="endTime">End Time</label>
            <div className="flex column">
              <Field type="time" id="endTime" name="endTime" />
              <ErrorMessage
                name="endTime"
                render={(errorMessage) => <FormErrorMessage>{errorMessage}</FormErrorMessage>}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn success" type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CalendarItemForm;
