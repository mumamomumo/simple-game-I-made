import { supabase } from "../utils/supabase";
import { userStore, setUserStore } from "../store/AppStore";
import { UserType } from "../types/UserType";
import { v4 as uuidv4 } from "uuid";

function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function loadFromSession() {
  if (sessionStorage.getItem("host_id") && sessionStorage.getItem("game_id")) {
    setUserStore({
      user_type: "host",
      host_id: sessionStorage.getItem("host_id") as string,
      game_id: sessionStorage.getItem("game_id") as string,
      game_data: JSON.parse(sessionStorage.getItem("game_data") as string),
      started: false,
    });
  }
}
export function saveToSession() {
  if (userStore.user_type === "host") {
    sessionStorage.setItem("host_id", userStore.host_id);
    sessionStorage.setItem("game_id", userStore.game_id);
    sessionStorage.setItem("game_data", JSON.stringify(userStore.game_data));
  }
}

// Host functions
export async function registerHost() {
  setUserStore({
    user_type: "host",
    host_id: uuidv4(),
    started: false,
    game_id: makeid(5),
    game_data: {
      prompt: "",
      duration: 10,
    },
  });

  if (userStore.user_type === "host") {
    await supabase.from("game_sessions").insert({
      host_id: userStore.host_id,
      game_id: userStore.game_id,
      started: false,
      game_data: JSON.stringify(userStore.game_data),
    });

    saveToSession();
  }
}
export async function unregisterHost() {
  if (userStore.user_type === "host") {
    await supabase
      .from("game_sessions")
      .delete()
      .eq("host_id", userStore.host_id);
  }
  setUserStore({ user_type: "guest" });
  sessionStorage.clear();
}
export async function updateDatabaseHost(data: Partial<UserType>) {
  if (userStore.user_type === "host") {
    await supabase
      .from("game_sessions")
      .update({
        ...data,
      })
      .eq("host_id", userStore.host_id);
  }
}

// Guest functions
export async function validGameId(game_id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select()
    .eq("game_id", game_id);
  if (error) {
    console.error(error);
    return false;
  }
  if (data.length > 0) {
    console.log("Valid game Id");
    return true;
  } else {
    return false;
  }
}
export async function isUserTaken(
  username: string,
  game_id: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("players_table")
    .select()
    .eq("game_id", game_id)
    .eq("username", username);
  console.log(data, error);
  if (error) {
    console.error(error);
    return false;
  }
  if (data.length > 0) {
    return false;
  } else {
    console.log(true);
    return true;
  }
}

export async function registerPlayer(game_id: string, username: string) {
  setUserStore({
    user_type: "player",
    game_id: game_id,
    username: username,
  });

  if (userStore.user_type === "player") {
    await supabase.from("players_table").insert({
      game_id: userStore.game_id,
      username: userStore.username,
    });
  }
}
export async function unregisterPlayer() {
  if (userStore.user_type === "player") {
    await supabase
      .from("players_table")
      .delete()
      .eq("username", userStore.username);
  }
  setUserStore({ user_type: "guest" });
}
