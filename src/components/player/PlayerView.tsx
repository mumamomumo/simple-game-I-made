import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import {
  unregisterPlayer,
  listenToGame,
  updateDatabasePlayer,
} from "../../data/GameData";
import { setUserStore, userStore } from "../../store/AppStore";
import { createEffect, createSignal, For } from "solid-js";
import Progressbar from "./Progressbar";

// Subscribe to the game_data column in the game_sessions table
// Show the game data
function PlayerView() {
  if (userStore.user_type !== "player") return null;

  const [gamePrompt, setGamePrompt] = createSignal("");
  const [gameStarted, setGameStarted] = createSignal(false);
  const [gameStarting, setGameStarting] = createSignal(false);
  const [gameStartingTime, setGameStartingTime] = createSignal(3);
  const [gameDuration, setGameDuration] = createSignal(0);
  const [durationLeft, setDurationLeft] = createSignal(0);
  const [enteredWords, setEnteredWords] = createSignal<string[]>([]);

  let enteredWordsInput;
  let intervalCd: NodeJS.Timeout;
  let intervalDur: NodeJS.Timeout;
  // 3 2 1 Go
  createEffect(() => {
    if (gameStarting()) {
      console.log("starting");
      setGameStartingTime(3);
      setDurationLeft(gameDuration());
      intervalCd = setInterval(() => {
        setGameStartingTime((gameStartingTime) => gameStartingTime - 1);
      }, 1000);
    } else {
      console.log("stopped");
      clearInterval(intervalCd);
      setGameStarting(false);
    }
  });
  createEffect(() => {
    if (gameStartingTime() <= 0 && gameStarting()) {
      console.log(gameStartingTime());
      console.log("starting game");
      clearInterval(intervalCd);
      setGameStarting(false);
      setGameStarted(true);
      intervalDur = setInterval(() => {
        setDurationLeft((durationLeft) => durationLeft - 1);
      }, 1000);
    }
  });
  createEffect(() => {
    if (durationLeft() <= 0) {
      clearInterval(intervalDur);
      setGameStarted(false);
      setDurationLeft(0);
      setGamePrompt("");
    }
  });

  const resetGame = () => {
    enteredWordsInput!.value = "";
    console.log("resetting entered words");
    setEnteredWords([]);
    setUserStore({ entered_data: [] });
  };

  // Listen to the game_sessions table
  const onGameUpdate = (
    payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>
  ) => {
    setGameStarting(payload.new.started);
    setGameStarted(payload.new.started);
    setGameDuration(payload.new.game_data.duration);
    clearInterval(intervalDur);
    if (payload.new.started) {
      setGamePrompt(payload.new.game_data.prompt);
      resetGame();
    }
  };
  listenToGame(userStore.game_id, onGameUpdate);

  // Update the entered_data column in the players table
  const updateEnteredWords = () => {
    if (userStore.user_type !== "player" || enteredWordsInput!.value === "")
      return null;
    setEnteredWords((prev) => [...prev, enteredWordsInput!.value]);
    enteredWordsInput!.value = "";
    updateDatabasePlayer({ entered_data: enteredWords() });
  };
  return (
    <>
      {gameStarting() && (
        <div class="starting-overlay fixed w-screen h-screen bg-[rgba(0,0,0,0.7)] text-white">
          <div class="flex flex-col justify-center items-center h-[100svh]">
            <h1 class="text-2xl">
              Game starting in {gameStartingTime()} seconds
            </h1>
          </div>
        </div>
      )}
      <div class="app-player-view w-full h-full flex flex-col justify-center items-center flex-1">
        <div class="w-[90svw] h-[80svh] max-w-[500px] flex flex-col bg-secondary-900 rounded-xl p-5 gap-3">
          <div>
            <div class="app-player-top flex justify-between items-center">
              <button onClick={unregisterPlayer} class="warning">
                Quit
              </button>
              <h1 class="text-center text-xl">Welcome, {userStore.username}</h1>
              <div class="w-12" />
            </div>
          </div>
          <div class="app-player-main flex flex-col items-center px-10 py-0 h-full">
            <h1
              class={
                "text-center text-[1.3rem]" +
                " " +
                (gameStarted()
                  ? ""
                  : "underline decoration-accent-100 decoration-[5px] underline-offset-8")
              }
            >
              {gamePrompt() ? gamePrompt() : "Prompt will show up here"}
            </h1>
            <div class="flex flex-col gap-1 w-full mt-5 mb-5">
              <label for="user-input" class="">
                Enter your word:{" "}
              </label>
              <input
                id="user-input"
                class="flex-1"
                placeholder="Word"
                disabled={!gameStarted()}
                ref={enteredWordsInput}
              />
            </div>
            <button class="w-full" onClick={updateEnteredWords}>
              Submit
            </button>
            <div class="flex flex-col h-full w-full items-center bg-background-950 mt-2 p-2 rounded-md">
              <For each={enteredWords()}>
                {(word) => (
                  <div class="w-full my-2 p-2 text-center bg-white rounded-md">
                    {word}
                  </div>
                )}
              </For>
            </div>
            <progress
              value={durationLeft()}
              class="w-full accent-slate-500"
              max={gameDuration()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerView;
