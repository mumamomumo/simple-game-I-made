import { supabase } from "../utils/supabase";
import { userStore, setUserStore } from "../store/AppStore";
import { UserType } from "../types/UserType";
import { v4 as uuidv4 } from "uuid";

const GAME_SESSION_TABLE = "game_sessions";
const PLAYERS_TABLE = "players_table";

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

export async function loadFromSession() {
  const saved_host_id = sessionStorage.getItem("host_id");
  const saved_game_id = sessionStorage.getItem("game_id");
  const username = sessionStorage.getItem("username");
  if (saved_host_id && saved_game_id) {
    const { data, error } = await supabase
      .from(GAME_SESSION_TABLE)
      .select()
      .eq("host_id", saved_host_id)
      .eq("game_id", saved_game_id);

    if (data && data.length > 0 && !error) {
      setUserStore({
        user_type: "host",
        host_id: saved_host_id,
        started: data[0].started,
        game_id: saved_game_id,
        game_data: data[0].game_data,
      });
    }
  } else if (username && saved_game_id) {
    const { data, error } = await supabase
      .from(PLAYERS_TABLE)
      .select()
      .eq("username", username)
      .eq("game_id", saved_game_id);

    if (data && data.length > 0 && !error) {
      setUserStore({
        user_type: "player",
        username: username,
        game_id: saved_game_id,
        entered_data: data[0].entered_data,
      });
    }
  }
}
export function saveToSession() {
  if (userStore.user_type === "host") {
    sessionStorage.setItem("host_id", userStore.host_id);
    sessionStorage.setItem("game_id", userStore.game_id);
    sessionStorage.setItem("game_data", JSON.stringify(userStore.game_data));
  } else if (userStore.user_type === "player") {
    sessionStorage.setItem("username", userStore.username);
    sessionStorage.setItem("game_id", userStore.game_id);
    sessionStorage.setItem(
      "entered_data",
      JSON.stringify(userStore.entered_data)
    );
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
    history: new Array(),
  });

  if (userStore.user_type === "host") {
    await supabase.from(GAME_SESSION_TABLE).insert({
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
      .from(GAME_SESSION_TABLE)
      .delete()
      .eq("host_id", userStore.host_id);
  }
  setUserStore({ user_type: "guest" });
  sessionStorage.clear();
}
export async function updateDatabaseHost(data: Partial<UserType>) {
  if (userStore.user_type === "host") {
    setUserStore(data);
    console.log({ ...data });
    await supabase
      .from(GAME_SESSION_TABLE)
      .update({
        ...data,
      })
      .eq("host_id", userStore.host_id);
  }
}
export async function getPlayers() {
  if (userStore.user_type !== "host") return;
  const { data, error } = await supabase
    .from(PLAYERS_TABLE)
    .select()
    .eq("game_id", userStore.game_id);
  if (error) {
    console.error(error);
  }
  return data;
}
export async function getHistory() {
  if (userStore.user_type !== "host") return;
  const { data, error } = await supabase
    .from(GAME_SESSION_TABLE)
    .select()
    .eq("host_id", userStore.host_id);
  if (error) {
    console.error(error);
  }
  if (data && data.length > 0) {
    console.log(data.map((h) => h.history));
    return data.map((h) => h.history);
  } else {
    return [];
  }
}
export async function listenToPlayers(game_id: string, callback: Function) {
  await supabase
    .channel(PLAYERS_TABLE)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: PLAYERS_TABLE,
        filter: `game_id=eq.${game_id}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}

// Player functions
export async function validGameId(game_id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from(GAME_SESSION_TABLE)
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
    .from(PLAYERS_TABLE)
    .select()
    .eq("game_id", game_id)
    .eq("username", username);
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
    entered_data: [],
  });

  if (userStore.user_type === "player") {
    await supabase.from(PLAYERS_TABLE).insert({
      game_id: userStore.game_id,
      username: userStore.username,
    });
  }

  saveToSession();
}
export async function unregisterPlayer() {
  if (userStore.user_type === "player") {
    await supabase
      .from(PLAYERS_TABLE)
      .delete()
      .eq("username", userStore.username);
  }
  setUserStore({ user_type: "guest" });
  sessionStorage.clear();
}
export async function listenToGame(game_id: string, callback: Function) {
  await supabase
    .channel(GAME_SESSION_TABLE)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: GAME_SESSION_TABLE,
        filter: `game_id=eq.${game_id}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}
export async function updateDatabasePlayer(data: Partial<UserType>) {
  if (userStore.user_type === "player") {
    setUserStore(data);
    await supabase
      .from(PLAYERS_TABLE)
      .update({
        ...data,
      })
      .eq("username", userStore.username);
  }
}
