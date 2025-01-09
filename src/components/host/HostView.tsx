import { userStore, setUserStore } from "../../store/AppStore";
import {
  saveToSession,
  unregisterHost,
  updateDatabaseHost,
} from "../../data/GameData";
import { onMount } from "solid-js";
function HostView() {
  if (userStore.user_type !== "host") return null;
  let promptInput;
  let durationInput;

  // Update the database, sessionStorage, and the App State when the user is done editing
  const onInputBlur = () => {
    setUserStore({
      game_data: { prompt: promptInput!.value, duration: durationInput!.value },
    });
    updateDatabaseHost({
      game_data: userStore.user_type === "host" ? userStore.game_data : {},
    });
    saveToSession();
  };
  // Set the inputs to the game data
  onMount(() => {
    if (userStore.user_type !== "host") return;
    promptInput!.value = userStore.game_data.prompt;
    durationInput!.value = userStore.game_data.duration;
  });

  return (
    <>
      <div class="app-host-view w-full h-full flex flex-col justify-center items-center">
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
                name="prompt"
                placeholder="Enter prompt"
                onBlur={onInputBlur}
              />
            </div>
            <div class="w-1/2 flex flex-col">
              <label for="duration">Duration:</label>
              <input
                placeholder="Enter duration"
                name="duration"
                ref={durationInput}
                type="number"
                onBlur={onInputBlur}
              />
            </div>
          </div>
          <div>
            <button class="w-full">Start</button>
          </div>
          <div class="flex-1 bg-slate-200"></div>
        </div>
      </div>
    </>
  );
}

export default HostView;
