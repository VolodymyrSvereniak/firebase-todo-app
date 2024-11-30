import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

interface ITodos {
  id: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

type TodosWithoutId = Omit<ITodos, "id">;

export const getAllTodos = async (): Promise<ITodos[]> => {
  const q = query(collection(db, "todos"), orderBy("createdAt"));

  try {
    const querySnapshot = await getDocs(q);
    const todos: ITodos[] = querySnapshot.docs.map((doc) => {
      const data: TodosWithoutId = doc.data() as TodosWithoutId;
      return {
        id: doc.id,
        ...data,
      };
    });
    return todos;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw Error("Something went wrong");
  }
};

export const addTodo = async (
  e: React.FormEvent<HTMLFormElement>,
  inputValue: string
) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "todos"), {
      title: inputValue,
      isActive: true,
      isCompleted: false,
      createdAt: serverTimestamp(),
    } as TodosWithoutId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw Error("Something went wrong");
  }
};

export const deleteTodo = async (id: string) => {
  try {
    await deleteDoc(doc(db, "todos", id));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw Error("Something went wrong");
  }
};

export const setAsCompleted = async (
  id: string,
  completedStatus: boolean,
  setNonActiveStatus: boolean
) => {
  const todoRef = doc(db, "todos", id);

  try {
    await updateDoc(todoRef, {
      isCompleted: completedStatus,
      isActive: setNonActiveStatus,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw Error("Something went wrong");
  }
};

export const deleteCompletedTodos = async () => {
  try {
    const q = query(collection(db, "todos"), where("isCompleted", "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.map((document) => {
      const docRef = doc(db, "todos", document.id);
      deleteDoc(docRef);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw Error("Something went wrong");
  }
};
