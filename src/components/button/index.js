import style from './style.css'

const Button = ({ name, onClick, ...restProps }) => {
  return (
    <button
      className={style.button}
      onClick={onClick}
      {...restProps}
    >
      {name}
    </button>
  )
}

export default Button