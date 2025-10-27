const Button = ({ btnText, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-purple-600 hover:bg-purple-700 text-white py-3 px-5 font-bold rounded-2xl text-center transition-colors duration-200 ${className}`}
    >
      {btnText}
    </button>
  )
}

export default Button
