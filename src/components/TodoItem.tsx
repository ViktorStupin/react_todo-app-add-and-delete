import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingTitle: string;
  isTemp: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onStartEditing: () => void;
  onEditChange: (title: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditKeyPress: (event: React.KeyboardEvent) => void;
  onEditBlur: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  isEditing,
  editingTitle,
  isTemp,
  onToggle,
  onDelete,
  onStartEditing,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onEditKeyPress,
  onEditBlur,
}) => {
  const handleDoubleClick = () => {
    if (!isLoading && !isTemp) {
      onStartEditing();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancelEdit();
    }

    onEditKeyPress(event);
  };

  if (isEditing && !isTemp) {
    return (
      <div
        className={`todo ${todo.completed ? 'completed' : ''}`}
        data-cy="Todo"
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={onToggle}
          />
        </label>

        <form
          onSubmit={e => {
            e.preventDefault();
            onSaveEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={e => onEditChange(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={onEditBlur}
            autoFocus
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTemp}
          onChange={onToggle}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={handleDoubleClick}
      >
        {todo.title}
      </span>

      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading || isTemp ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
