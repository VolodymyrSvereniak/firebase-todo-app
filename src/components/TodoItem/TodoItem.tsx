import styled from "./TodoItem.module.scss";
import checkMark from "../../assets/icon-check.svg";
import deleteMark from "../../assets/icon-cross.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface TodoItemProps {
  currentTodoID: string;
  isCompletedMark: boolean;
  todoTitle: string;
  handleDeleteTodo: () => void;
  handleAsCompleted: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  currentTodoID,
  isCompletedMark,
  todoTitle,
  handleDeleteTodo,
  handleAsCompleted,
}) => {
  const [isDraggable, setIsDraggable] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: currentTodoID, disabled: !isDraggable });

  const handleDisableDragging = (e: React.MouseEvent, action: boolean) => {
    e.stopPropagation();
    setIsDraggable(action);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <li
      className={styled.itemWrapper}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <button
        className={styled.deleteButton}
        onClick={handleDeleteTodo}
        onMouseOver={(e) => handleDisableDragging(e, false)}
        onMouseOut={(e) => handleDisableDragging(e, true)}
      >
        <img src={deleteMark} alt="delete" />
      </button>
      <button
        className={`${styled.submitButton} ${
          isCompletedMark && styled.markedSubmitButton
        }`}
        onClick={handleAsCompleted}
        onMouseOver={(e) => handleDisableDragging(e, false)}
        onMouseOut={(e) => handleDisableDragging(e, true)}
      >
        {isCompletedMark && <img src={checkMark} alt="checkMark" />}
      </button>
      <span className={isCompletedMark ? styled.title : ""}>{todoTitle}</span>
    </li>
  );
};

export default TodoItem;
