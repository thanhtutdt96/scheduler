import ReactDOM from 'react-dom';
import './styles.scss';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { setToastVisibility } from 'redux/slices/toastSlice';
import { ToastType } from 'types/Common';

const Toast = () => {
  const { isToastVisible, toastMessage, toastType } = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();

  return isToastVisible
    ? ReactDOM.createPortal(
        <>
          <div
            className={`toast ${
              toastType === ToastType.SUCCESS ? 'toast--success' : 'toast--error'
            }`}
          >
            <div className="flex items-center">
              <p className="ma-0 text-sm text-medium">{toastMessage}</p>
              <button
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                className="ml-md"
                onClick={() => dispatch(setToastVisibility(false))}
              >
                <span aria-hidden="true" className="text-lg">
                  &times;
                </span>
              </button>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;
};

export default Toast;
