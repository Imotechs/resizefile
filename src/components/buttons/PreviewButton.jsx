const PreviewButton = ({ action }) => {
  return (
    <button
      className="group relative inline-flex items-center gap-3 px-3 py-1.5 bg-purple-700 text-white font-semibold rounded-full text-sm overflow-hidden transition-all duration-300 hover:bg-black"
      style={{ "--clr": "#7808d0" }}
      onClick={action}
    >
      <span
        className="relative flex items-center justify-center w-5 h-5 bg-white text-purple-700 rounded-full overflow-hidden transition-all duration-300 group-hover:text-black"
        style={{ color: "var(--clr)" }}
      >
        {/* Static Eye Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="absolute w-4 h-4 transform transition-transform group-hover:translate-x-full group-hover:-translate-y-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>

        {/* Moving Eye Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="absolute w-4 h-4 transform translate-x-[-150%] translate-y-[150%] transition-transform group-hover:translate-x-0 group-hover:translate-y-0 delay-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </span>
      Preview
    </button>
  );
};

export default PreviewButton;
