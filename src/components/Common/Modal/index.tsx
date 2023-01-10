import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';

interface Props {
  isShowing: boolean;
  hideModal: () => void;
  children: ReactNode;
  header?: ReactNode;
}

const Modal: FC<Props> = ({ isShowing, hideModal, children, header }) =>
  isShowing
    ? ReactDOM.createPortal(
        <>
          <div className="modal__overlay" />
          <div
            className="modal__wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            onClick={() => hideModal()}
          >
            <div className="modal" role="presentation" onClick={(event) => event.stopPropagation()}>
              <div className="modal__header">
                {header}
                <button
                  type="button"
                  className="modal__close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => hideModal()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              {children}
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

export default Modal;
