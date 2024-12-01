import styled from "./TodosList.module.scss";
import {
  getAllTodos,
  deleteTodo,
  setAsCompleted,
} from "../../services/todosDBService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TodoItem from "../TodoItem/TodoItem";
import TodosControls from "./TodosControls";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface IUpdateTodoStatus {
  todoID: string;
  selectCompletedID: boolean;
  setNonActiveStatus: boolean;
}

const TodosList = () => {
  const [filterTodos, setFilterTodos] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
    staleTime: Infinity,
  });
  console.log(data);

  const filteredTodos = data?.filter((todo) => {
    if (filterTodos === "completed") return todo.isCompleted;
    if (filterTodos === "active") return todo.isActive;
    return true;
  });

  const itemsLeft = (data ?? []).filter(
    (todo) => todo.isCompleted === false
  ).length;
  console.log(itemsLeft);

  const queryClient = useQueryClient();

  const { mutate: handleDeleteTodo } = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: handleAsCompleted } = useMutation({
    mutationFn: ({
      todoID,
      selectCompletedID,
      setNonActiveStatus,
    }: IUpdateTodoStatus) =>
      setAsCompleted(todoID, selectCompletedID, setNonActiveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) {
    return <PulseLoader className={styled.loader} />;
  }

  return (
    <div className={styled.container}>
      {filteredTodos && filteredTodos?.length > 0 ? (
        <DndContext collisionDetection={closestCorners} modifiers={[restrictToParentElement]}>
          <ul className={styled.todosList}>
            <SortableContext
              items={filteredTodos}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos?.map((todo) => (
                <TodoItem
                  key={todo.id}
                  currentTodoID={todo.id}
                  isCompletedMark={todo.isCompleted}
                  todoTitle={todo.title}
                  handleDeleteTodo={() => handleDeleteTodo(todo.id)}
                  handleAsCompleted={() =>
                    handleAsCompleted({
                      todoID: todo.id,
                      selectCompletedID: !todo.isCompleted,
                      setNonActiveStatus: !todo.isActive,
                    })
                  }
                />
              ))}
            </SortableContext>
          </ul>
        </DndContext>
      ) : (
        <p className={styled.emptyList}>There are no todos yet</p>
      )}
      <TodosControls
        filterTodos={filterTodos}
        setFilterTodos={setFilterTodos}
        itemsLeft={itemsLeft}
      />
    </div>
  );
};

export default TodosList;
