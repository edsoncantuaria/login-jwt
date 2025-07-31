import Input from "./Input"; // importa seu componente base

function InputWithError({ error, ...props }) {
  return (
    <div className="relative mb-6">
      <Input
        {...props}
        className={`w-full px-4 py-2 border rounded-md
          bg-white text-black
          md:bg-white md:text-black
          dark:bg-gray-700 dark:text-white
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
      />

      {error && (
        <div
          id="error-message"
          className="absolute -top-9 right-0 bg-red-500 text-white text-xs rounded px-3 py-1 shadow-lg z-10 animate-fade-in"
        >
          {error}
          <div
            id="error-arrow"
            className="absolute left-3 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500"
          />
        </div>
      )}
    </div>
  );
}

export default InputWithError;
