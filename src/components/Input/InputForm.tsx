import styled from "./InputForm.module.scss";
import { useInputStore } from "./useInputStore";
import { addTodo } from "../../services/todosDBService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const InputForm = () => {
  const { inputValue, setInputValue, clearInputValue } = useInputStore();
  console.log(inputValue);

  const queryClient = useQueryClient();

  const { mutate: handleAddTodo } = useMutation({
    mutationFn: (e: React.FormEvent<HTMLFormElement>) =>
      addTodo(e, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      clearInputValue();
    },
  });

  return (
    <form className={styled.container} onSubmit={(e) => handleAddTodo(e)}>
      <input
        className={styled.input}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Create a new todo..."
      />
      <button className={styled.submitButton} type="submit" />
    </form>
  );
};

export default InputForm;
