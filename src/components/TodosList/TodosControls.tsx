import styled from "./TodosList.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompletedTodos } from "../../services/todosDBService";

interface ITodosControlsProps {
  filterTodos: string;
  setFilterTodos: React.Dispatch<React.SetStateAction<string>>;
  itemsLeft: number;
}

const TodosControls: React.FC<ITodosControlsProps> = ({
  filterTodos,
  setFilterTodos,
  itemsLeft,
}) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteCompletedTodos(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleClearing = () => {
    mutate();
  };

  return (
    <section className={styled.controls}>
      <span className={styled.itemsLeft}>{itemsLeft} items left</span>
      <ul className={styled.controlsButtons}>
        <li
          className={`${filterTodos === "all" && styled.all}`}
          onClick={() => setFilterTodos("all")}
        >
          All
        </li>
        <li
          className={`${filterTodos === "active" && styled.active}`}
          onClick={() => setFilterTodos("active")}
        >
          Active
        </li>
        <li
          className={`${filterTodos === "completed" && styled.completed}`}
          onClick={() => setFilterTodos("completed")}
        >
          Completed
        </li>
      </ul>
      <button className={styled.clearButton} onClick={handleClearing}>
        Clear completed
      </button>
    </section>
  );
};

export default TodosControls;
