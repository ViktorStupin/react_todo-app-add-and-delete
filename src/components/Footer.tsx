import * as React from 'react';
import { Filter } from '../types/Filter';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span data-cy="TodosCounter" className="todo-count">
      {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={filter === Filter.All ? 'selected' : ''}
        onClick={() => onFilterChange(Filter.All)}
      >
        All
      </a>
      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={filter === Filter.Active ? 'selected' : ''}
        onClick={() => onFilterChange(Filter.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={filter === Filter.Completed ? 'selected' : ''}
        onClick={() => onFilterChange(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      disabled={completedTodosCount === 0}
    >
      Clear completed
    </button>
  </footer>
);
