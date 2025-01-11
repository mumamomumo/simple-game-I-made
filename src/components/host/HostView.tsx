import { userStore, setUserStore } from "../../store/AppStore";
import {
  saveToSession,
  unregisterHost,
  updateDatabaseHost,
  listenToPlayers,
} from "../../data/GameData";
import { createSignal, For, onMount } from "solid-js";
import PlayerList from "./PlayerList";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import HistoryList from "./HistoryList";
import DurationProgressbar from "./DurationProgressbar";
function HostView() {
  if (userStore.user_type !== "host") return null;
  let promptInput;
  let durationInput;

  const [showPlayers, setShowPlayers] = createSignal(false);
  const [showHistory, setShowHistory] = createSignal(false);
  const [enteredWords, setEnteredWords] = createSignal<string[]>([]);
  const [durationLeft, setDurationLeft] = createSignal(0);

  // Update the database, sessionStorage, and the App State when the user is done editing
  const onInputBlur = () => {
    if (userStore.user_type !== "host" || promptInput!.value === "") return;
    updateDatabaseHost({
      game_data: {
        prompt: promptInput!.value,
        duration: durationInput!.value,
      },
    });
    saveToSession();
  };
  // Starting and stopping the game
  const onToggleStart = () => {
    if (
      userStore.user_type !== "host" ||
      promptInput!.value === "" ||
      durationInput!.value === ""
    )
      return;
    const alreadyStarted = userStore.started;
    if (alreadyStarted) {
      resetGame();
    } else {
      startGame();
    }
  };
  const startGame = () => {
    if (userStore.user_type !== "host" || promptInput!.value === "") return;
    updateDatabaseHost({ started: true });
    setEnteredWords([]);
    saveToSession();
  };
  const resetGame = () => {
    if (userStore.user_type !== "host" || promptInput!.value === "") return;
    updateDatabaseHost({ started: false });
    setDurationLeft(
      userStore.game_data.duration ? userStore.game_data.duration : 10
    );
  };
  // Set the inputs to the game data
  onMount(() => {
    if (userStore.user_type !== "host") return;
    promptInput!.value = userStore.game_data.prompt || "";
    durationInput!.value = userStore.game_data.duration || 10;
  });
  // Listen to the players inputs
  const onPlayersUpdate = (
    payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>
  ) => {
    if (userStore.user_type !== "host") return;
    const parsedData = JSON.parse(payload.new.entered_data);
    setEnteredWords((prev) => [
      ...prev,
      `${payload.new.username} entered "${parsedData[parsedData.length - 1]}"`,
    ]);
  };
  listenToPlayers(userStore.game_id, onPlayersUpdate);

  // Save the current prompt and words to history and create a new prompt
  const newPrompt = () => {
    if (userStore.user_type !== "host" || promptInput!.value.trim() === "")
      return;
    if (enteredWords().length === 0) {
      promptInput!.value = "";
      return;
    }
    setUserStore({
      history: [
        ...userStore.history,
        { prompt: promptInput!.value, words: enteredWords(), id: Date.now() },
      ],
    });
    setEnteredWords([]);
    promptInput!.value = "";
    sessionStorage.setItem("history", JSON.stringify(userStore.history));
    saveToSession();
  };

  return (
    <>
      <div class="w-full h-full flex">
        <div class="app-host-view w-full h-full flex flex-col justify-center items-center flex-1">
          <div class="w-[90svw] h-[80svh] max-w-[500px] flex flex-col justify-between  bg-secondary-900 rounded-xl p-5 gap-3">
            <div class="app-host-top flex justify-between items-center">
              <button onClick={unregisterHost} class="warning">
                Quit
              </button>
              <h1 class="text-xl flex-1 text-center">
                Game code: {userStore.game_id}
              </h1>
              <div />
            </div>
            <div class="flex gap-2">
              <div class="w-1/2 flex flex-col">
                <label for="prompt">Prompt:</label>
                <input
                  ref={promptInput}
                  id="prompt"
                  placeholder="Enter prompt"
                  onBlur={onInputBlur}
                  disabled={userStore.started || enteredWords().length > 0}
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck={false}
                />
              </div>
              <div class="w-1/2 flex flex-col">
                <label for="duration">Duration:</label>
                <input
                  placeholder="Enter duration"
                  id="duration"
                  ref={durationInput}
                  type="number"
                  onBlur={onInputBlur}
                  disabled={userStore.started}
                />
              </div>
            </div>
            <div class="flex gap-2">
              <button class="flex-1" onClick={onToggleStart}>
                {userStore.started ? "Stop" : "Start"}
              </button>
              <button
                class="flex-1"
                disabled={userStore.started}
                onClick={newPrompt}
              >
                {" "}
                New Prompt
              </button>
            </div>
            <DurationProgressbar
              durationLeft={durationLeft()}
              setDurationLeft={setDurationLeft}
              onDurationEnd={resetGame}
            />
            <div class="flex flex-col h-full w-full items-center bg-background-950 mt-2 p-2 rounded-md overflow-y-scroll">
              <For each={enteredWords()}>
                {(word) => (
                  <div class="w-full my-2 p-2 text-center bg-white rounded-md">
                    {word}
                  </div>
                )}
              </For>
            </div>
            <div class="flex justify-between">
              <p
                onClick={() => {
                  setShowHistory(false);
                  setShowPlayers(!showPlayers());
                }}
                class="cursor-pointer hover:underline"
              >
                Show players
              </p>
              <p
                onClick={() => {
                  setShowPlayers(false);
                  setShowHistory(!showHistory());
                }}
                class="cursor-pointer hover:underline"
              >
                Show history
              </p>
            </div>
          </div>
        </div>
        <div
          class={
            "h-full" +
            " " +
            (showPlayers() || showHistory() ? "px-5" : "hidden")
          }
        >
          {showPlayers() && (
            <div class="w-full h-full flex flex-col justify-center items-center flex-1">
              <div class="w-[90svw] h-[80svh] max-w-[500px] flex flex-col justify-between  bg-secondary-900 rounded-xl p-5 gap-3">
                <PlayerList />
              </div>
            </div>
          )}
          {showHistory() && (
            <div class="w-full h-full flex flex-col justify-center items-center flex-1">
              <div class="w-[90svw] h-[80svh] max-w-[500px] flex flex-col justify-between  bg-secondary-900 rounded-xl p-5 gap-3">
                <HistoryList />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HostView;
