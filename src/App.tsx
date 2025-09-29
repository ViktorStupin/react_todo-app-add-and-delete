/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const hideError = useCallback(() => {
    setErrorMessage('');
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
  }, []);

  const focusInput = useCallback(() => {
    newTodoInputRef.current?.focus();
  }, []);

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setLoadingTodosIds(prev => [...prev, id]);

      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));
        focusInput();
      } catch {
        showError('Unable to delete a todo');
      } finally {
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      }
    },
    [focusInput, showError],
  );

  const handleStartEditing = useCallback((todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: number) => {
      const trimmedTitle = editingTitle.trim();

      if (!trimmedTitle) {
        await handleDeleteTodo(id);
        setEditingTodoId(null);

        return;
      }

      const originalTodo = todos.find(todo => todo.id === id);

      if (trimmedTitle === originalTodo?.title) {
        setEditingTodoId(null);

        return;
      }

      setLoadingTodosIds(prev => [...prev, id]);

      try {
        const updatedTodo = await updateTodo(id, { title: trimmedTitle });

        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
        setEditingTodoId(null);
      } catch {
        showError('Unable to update a todo');
      } finally {
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      }
    },
    [editingTitle, todos, handleDeleteTodo, showError],
  );

  const handleCancelEdit = useCallback(() => {
    setEditingTodoId(null);
    setEditingTitle('');
  }, []);

  const handleEditKeyPress = useCallback(
    (event: React.KeyboardEvent, id: number) => {
      if (event.key === 'Enter') {
        handleSaveEdit(id);
      } else if (event.key === 'Escape') {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit],
  );

  const handleEditBlur = useCallback(
    (id: number) => {
      handleSaveEdit(id);
    },
    [handleSaveEdit],
  );

  const handleAddTodo = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = newTodoTitle.trim();

      if (!trimmedTitle) {
        showError('Title should not be empty');

        return;
      }

      setIsInputDisabled(true);

      const tempTodoData: Todo = {
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setTempTodo(tempTodoData);

      try {
        const createdTodo = await createTodo({
          title: trimmedTitle,
          userId: USER_ID,
          completed: false,
        });

        setNewTodoTitle('');

        setTodos(prev => [...prev, createdTodo]);
      } catch {
        showError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setIsInputDisabled(false);
        focusInput();
      }
    },
    [newTodoTitle, focusInput, showError],
  );

  const handleToggleTodo = useCallback(
    async (id: number) => {
      const todoToUpdate = todos.find(todo => todo.id === id);

      if (!todoToUpdate) {
        return;
      }

      setLoadingTodosIds(prev => [...prev, id]);

      try {
        const updatedTodo = await updateTodo(id, {
          completed: !todoToUpdate.completed,
        });

        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      } catch {
        showError('Unable to update a todo');
      } finally {
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      }
    },
    [todos, showError],
  );

  const handleToggleAll = useCallback(async () => {
    const allCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);
    const todosToUpdate = allCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(t => t.id);

    setLoadingTodosIds(prev => [...prev, ...idsToUpdate]);

    try {
      const updatePromises = todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: !allCompleted }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(prev =>
        prev.map(todo => {
          const updated = updatedTodos.find(t => t.id === todo.id);

          return updated || todo;
        }),
      );
    } catch {
      showError('Unable to update todos');
    } finally {
      setLoadingTodosIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  }, [todos, showError]);

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const completedIds = completedTodos.map(t => t.id);

    setLoadingTodosIds(prev => [...prev, ...completedIds]);

    const deleteResults = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeleted: number[] = [];
    const failedDeletions: number[] = [];

    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfullyDeleted.push(completedTodos[index].id);
      } else {
        failedDeletions.push(completedTodos[index].id);
      }
    });

    if (successfullyDeleted.length > 0) {
      setTodos(prev =>
        prev.filter(todo => !successfullyDeleted.includes(todo.id)),
      );
    }

    if (failedDeletions.length > 0 && successfullyDeleted.length === 0) {
      showError('Unable to delete a todo');
    }

    setLoadingTodosIds(prev => prev.filter(id => !completedIds.includes(id)));
    focusInput();
  }, [todos, focusInput, showError]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos || []);
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, [showError]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  let todosToDisplay = filteredTodos;

  if (tempTodo) {
    const shouldShowTemp =
      filter === Filter.All ||
      (filter === Filter.Active && !tempTodo.completed) ||
      (filter === Filter.Completed && tempTodo.completed);

    if (shouldShowTemp) {
      todosToDisplay = [...filteredTodos, tempTodo];
    }
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const shouldShowFooter = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          isAllCompleted={isAllCompleted}
          newTodoTitle={newTodoTitle}
          newTodoInputRef={newTodoInputRef}
          isInputDisabled={isInputDisabled}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          setNewTodoTitle={setNewTodoTitle}
        />

        <TodoList
          todos={todosToDisplay}
          loadingTodosIds={loadingTodosIds}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onStartEditing={handleStartEditing}
          onEditChange={setEditingTitle}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onEditKeyPress={handleEditKeyPress}
          onEditBlur={handleEditBlur}
          tempTodo={tempTodo}
        />

        {shouldShowFooter && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onHide={hideError} />
    </div>
  );
};
