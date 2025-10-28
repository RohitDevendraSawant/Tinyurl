const Button = ({ btnText, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-2 sm:py-3 sm:px-5 w-20 sm:w-26 font-bold rounded-2xl text-center transition-colors duration-200 ${className}`}
    >
      {btnText}
    </button>
  )
}

export default Button
