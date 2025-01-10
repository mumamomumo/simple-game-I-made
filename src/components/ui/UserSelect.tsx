import { createSignal } from "solid-js";
import {
  registerHost,
  validGameId,
  isUserTaken,
  registerPlayer,
} from "../../data/GameData";
function UserSelect(props: { setPlayerState: Function; playerState: number }) {
  let gameIdInput;
  let usernameInput;

  const [gameIdError, setGameIdError] = createSignal(false);
  const [usernameError, setUsernameError] = createSignal(false);
  const [gameId, setGameId] = createSignal("");

  const handleSubmitId = async () => {
    setGameIdError(false);
    var gameId: string = gameIdInput!.value.trim();
    gameId = gameId.toUpperCase();
    if (gameId === "") return;
    if (await validGameId(gameId)) {
      setGameId(gameId);
      props.setPlayerState(2);
    } else {
      console.log("Invalid game Id");
      setGameIdError(true);
    }
  };

  const handleSubmitUser = async () => {
    setUsernameError(false);
    const username = usernameInput!.value;
    if (username === "") return;
    console.log("user");
    if (!(await isUserTaken(username, gameId()))) {
      console.log("error");
      setUsernameError(true);
    } else {
      console.log("register");
      registerPlayer(gameId(), username);
      props.setPlayerState(0);
    }
  };

  return (
    <>
      <div class="app-user-select w-full h-full flex flex-col justify-center items-center">
        <div class="bg-secondary-900 rounded-xl p-5 px-7">
          {props.playerState === 0 && (
            <>
              <h1 class="text-3xl">Would you like to:</h1>
              <div class="flex gap-4 flex-col my-4">
                <button onClick={registerHost}>Host a game</button>
                <button onClick={() => props.setPlayerState(1)}>
                  Join a game
                </button>
              </div>
            </>
          )}
          {props.playerState === 1 && (
            <div>
              <h1 class="text-3xl mb-5">Enter game code: </h1>
              <input
                class="w-full h-10"
                ref={gameIdInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitId();
                  }
                }}
              />
              {
                <p class="text-red-600">
                  {gameIdError() ? "Invalid game code" : ""}
                </p>
              }
              <div class="flex gap-2 pt-2">
                <button class="flex-1" onClick={() => props.setPlayerState(0)}>
                  Back
                </button>
                <button class="flex-1" onClick={handleSubmitId}>
                  Go
                </button>
              </div>
            </div>
          )}
          {props.playerState === 2 && (
            <div>
              <h1 class="text-3xl mb-5">Enter username: </h1>
              <input
                class="w-full h-10"
                ref={usernameInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitUser();
                  }
                }}
              />
              {
                <p class="text-red-600">
                  {usernameError() ? "Username taken" : ""}
                </p>
              }
              <div class="flex gap-2 pt-2">
                <button class="flex-1" onClick={() => props.setPlayerState(1)}>
                  Back
                </button>
                <button class="flex-1" onClick={handleSubmitUser}>
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSelect;
