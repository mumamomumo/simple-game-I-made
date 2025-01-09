import "./App.css";
import {
  loadFromSession,
  unregisterHost,
  unregisterPlayer,
} from "./data/GameData";
import { userStore } from "./store/AppStore";

// Components
import HostView from "./components/host/HostView";
import PlayerView from "./components/player/PlayerView";
import UserSelect from "./components/ui/UserSelect";
import { createSignal } from "solid-js";

/*
TODO:
  - The host will also be watching the users store for any users that are inserted and that have the same game_id as the one in the host column.
 - Create a guest page where users will have to enter a code.
    - The users will be watching the game_sessions table for any game that has the same game_id as the one in the users store.
    - The users will be watching the game_data column in the row of their game_id.
    - When users enter a word, the word will be saved to the entered_data column in the row of their game_id.

- When a user joins, show the user on the host's screen.
- Create a sessionStorage for users as well.
- When the user leaves the page, unregister the user from the database.
- Subscribe the user page to the game_data column in the game_sessions table.
- Allow the user to enter words, which get saved to the entered_data column in the game_sessions table.
*/

window.addEventListener("unload", async (e) => {
  e.preventDefault();
  if (userStore.user_type === "host") {
    unregisterHost();
  } else if (userStore.user_type === "player") {
    unregisterPlayer();
  }
});

loadFromSession();

export default function App() {
  const [playerState, setPlayerState] = createSignal(0);

  return (
    <div class="w-screen h-[100svh]">
      {userStore.user_type === "host" ? (
        <HostView />
      ) : userStore.user_type === "player" ? (
        <PlayerView />
      ) : (
        <UserSelect
          setPlayerState={setPlayerState}
          playerState={playerState()}
        />
      )}
    </div>
  );
}
