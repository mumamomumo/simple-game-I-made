import { createSignal, For } from "solid-js";
import { setUserStore, userStore } from "../../store/AppStore";
import { HistoryType } from "../../types/UserType";
import { BsTrash } from "solid-icons/bs";
import { saveToSession } from "../../data/GameData";
function HistoryListItem(props: { history: HistoryType }) {
  const wordsCount = props.history.words.length;

  const [expanded, setExpanded] = createSignal(false);

  const deleteHistory = () => {
    if (userStore.user_type !== "host") return;
    setUserStore({
      history: userStore.history.filter((h) => h.id !== props.history.id),
    });
    saveToSession();
  };

  return (
    <div
      class="w-full my-2 p-2 text-center bg-white rounded-md"
      onClick={() => setExpanded(!expanded())}
    >
      <div class="flex justify-between items-center">
        <div />
        {props.history.prompt}: {wordsCount} answer{wordsCount === 1 ? "" : "s"}
        <BsTrash onClick={deleteHistory} />
      </div>

      {expanded() && (
        <>
          <hr class="m-2" />
          <div class="flex flex-col">
            <ol class="list-decimal pl-10">
              {props.history.words.map((word) => (
                <li class="text-left underline py-2">{word}</li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

function HistoryList() {
  if (userStore.user_type !== "host") return;

  return (
    <div class="flex flex-col h-full p-0 m-0">
      <h1 class="text-center text-2xl">History</h1>
      <div class="flex flex-col h-full w-full items-center bg-background-950 mt-2 p-2 rounded-md overflow-y-scroll">
        <For each={userStore.history}>
          {(history) => <HistoryListItem history={history} />}
        </For>
      </div>
    </div>
  );
}

export default HistoryList;
