import styled from "./TodoItem.module.scss";
import checkMark from "../../assets/icon-check.svg";
import deleteMark from "../../assets/icon-cross.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: currentTodoID });

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
      <button className={styled.deleteButton} onClick={handleDeleteTodo}>
        <img src={deleteMark} alt="delete" />
      </button>
      <button
        className={`${styled.submitButton} ${
          isCompletedMark && styled.markedSubmitButton
        }`}
        onClick={handleAsCompleted}
      >
        {isCompletedMark && <img src={checkMark} alt="checkMark" />}
      </button>
      <span className={isCompletedMark ? styled.title : ""}>{todoTitle}</span>
    </li>
  );
};

export default TodoItem;
