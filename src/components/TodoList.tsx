import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loadingTodosIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEditing: (todo: Todo) => void;
  onEditChange: (title: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onEditKeyPress: (event: React.KeyboardEvent, id: number) => void;
  onEditBlur: (id: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loadingTodosIds,
  editingTodoId,
  editingTitle,
  onToggle,
  onDelete,
  onStartEditing,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onEditKeyPress,
  onEditBlur,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodosIds.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          isTemp={false}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onStartEditing={() => onStartEditing(todo)}
          onEditChange={onEditChange}
          onSaveEdit={() => onSaveEdit(todo.id)}
          onCancelEdit={onCancelEdit}
          onEditKeyPress={event => onEditKeyPress(event, todo.id)}
          onEditBlur={() => onEditBlur(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key="temp-todo"
          todo={tempTodo}
          isLoading={true}
          isEditing={false}
          editingTitle=""
          isTemp={true}
          onToggle={() => {}}
          onDelete={() => {}}
          onStartEditing={() => {}}
          onEditChange={() => {}}
          onSaveEdit={() => {}}
          onCancelEdit={() => {}}
          onEditKeyPress={() => {}}
          onEditBlur={() => {}}
        />
      )}
    </section>
  );
};
