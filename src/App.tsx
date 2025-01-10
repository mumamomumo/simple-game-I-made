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
import { createEffect, createSignal } from "solid-js";

/*
TODO:
 - Create a guest page where users will have to enter a code.

 Allow the host to create a new prompt, which saves the current prompt and words to history.
*/

loadFromSession();

export default function App() {
  const [playerState, setPlayerState] = createSignal(0);

  createEffect(() => {
    document.addEventListener("beforeunload", (e) => {
      if (userStore.user_type === "host") {
        unregisterHost();
      } else if (userStore.user_type === "player") {
        unregisterPlayer();
      }
      e.preventDefault();
    });
  });

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
