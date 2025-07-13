function Input(props) {
  return (
    <input
      className="w-full px-4 py-2 border rounded-md
        bg-white text-black
        md:bg-white md:text-black
        dark:bg-gray-700 dark:text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}

export default Input;
