import { createEffect, createSignal, Setter } from "solid-js";
import { userStore } from "../../store/AppStore";

function DurationProgressbar(props: {
  durationLeft: number;
  setDurationLeft: Setter<number>;
  onDurationEnd: Function;
}) {
  if (userStore.user_type !== "host") return null;

  const [startTimer, setStartTimer] = createSignal(false);
  const [startCountdown, setStartCountdown] = createSignal(0);
  let intervalDur: NodeJS.Timeout;
  let intervalCd: NodeJS.Timeout;

  createEffect(() => {
    if (userStore.user_type !== "host") return;
    if (startTimer() && userStore.started) {
      console.log("start");
      props.setDurationLeft(
        userStore.game_data.duration ? userStore.game_data.duration : 10
      );
      intervalDur = setInterval(() => {
        props.setDurationLeft((durationLeft) => durationLeft - 1);
      }, 1000);
    } else if (!startTimer() && userStore.started) {
      console.log("counddown");
      setStartCountdown(3);
      props.setDurationLeft(
        userStore.game_data.duration ? userStore.game_data.duration : 10
      );
      intervalCd = setInterval(() => {
        setStartCountdown((startCountdown) => startCountdown - 1);
      }, 1000);
    } else {
      clearInterval(intervalDur);
      clearInterval(intervalCd);
      setStartTimer(false);
    }
  });

  createEffect(() => {
    if (userStore.user_type !== "host") return;
    if (startCountdown() === 0) {
      setStartTimer(true);
      clearInterval(intervalCd);
    }
    if (props.durationLeft === 0) {
      clearInterval(intervalDur);
      setStartTimer(false);
      props.onDurationEnd();
    }
  });

  return (
    <div class="w-full my-1 p-2 text-center bg-white rounded-md">
      <div class="flex justify-between items-center">
        <div class="text-sm">Duration left</div>
        {startCountdown() === 3 ? (
          <div class="text-sm">Ready?</div>
        ) : startCountdown() === 2 ? (
          <div class="text-sm">Set </div>
        ) : startCountdown() === 1 ? (
          <div class="text-sm">Go</div>
        ) : null}
        <div class="text-sm">{props.durationLeft}</div>
      </div>
    </div>
  );
}

export default DurationProgressbar;
