import React from 'react';

interface HeaderProps {
  todosCount: number;
  isAllCompleted: boolean;
  newTodoTitle: string;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
  isInputDisabled: boolean;
  onAddTodo: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  setNewTodoTitle: (title: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  newTodoTitle,
  newTodoInputRef,
  isInputDisabled,
  onAddTodo,
  setNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          ref={newTodoInputRef}
          disabled={isInputDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
