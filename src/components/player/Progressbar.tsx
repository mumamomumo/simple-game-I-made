function Progressbar(props: { value: number; text?: string }) {
  return (
    <div class="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        class="h-full bg-blue-600 rounded-full  transition-all duration-[1500ms] ease-in-out"
        style={{ width: `${props.value}%` }}
      ></div>
    </div>
  );
}

export default Progressbar;
