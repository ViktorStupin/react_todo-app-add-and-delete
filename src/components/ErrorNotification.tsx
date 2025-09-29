import * as React from 'react';

interface Props {
  message: string;
  onHide: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onHide }) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${
      message ? '' : 'hidden'
    }`}
  >
    {message}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
  </div>
);
