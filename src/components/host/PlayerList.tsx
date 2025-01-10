import { createResource, For, Suspense } from "solid-js";
import { getPlayers } from "../../data/GameData";
import { FiRefreshCcw } from "solid-icons/fi";
import { AiOutlineLoading3Quarters } from "solid-icons/ai";
function PlayerList() {
  const [players, { refetch }] = createResource(async () => await getPlayers());
  return (
    <div class="app-host-player-list h-[80svh] max-w-[500px] flex flex-col">
      <div class="flex justify-between items-center">
        <FiRefreshCcw
          class="h-6 w-6 hover:animate-rotate-ccw"
          onClick={() => refetch()}
          title="Refresh"
        />
        <h1 class="text-center text-2xl">Players</h1>
        <div class="w-6" />
      </div>
      <Suspense
        fallback={
          <div class="w-full h-full flex justify-center items-center">
            <AiOutlineLoading3Quarters class="animate-spin w-[20%] h-[20%]" />
          </div>
        }
      >
        <div class="flex flex-col h-full items-center bg-background-950 my-10 p-3 rounded-md">
          <For each={players()}>
            {(player) => (
              <div class="w-full my-2 p-2 text-center bg-white rounded-md">
                {player.username}
              </div>
            )}
          </For>
        </div>
      </Suspense>
    </div>
  );
}

export default PlayerList;
