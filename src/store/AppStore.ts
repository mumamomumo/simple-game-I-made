import { createStore } from "solid-js/store";
import { UserType } from "../types/UserType";

export const [userStore, setUserStore] = createStore<UserType>({
  user_type: "guest",
});
