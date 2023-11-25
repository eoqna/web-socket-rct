import React, { ChangeEventHandler, FormEventHandler, MouseEvent } from "react";
import styles from "./Input.module.css";

type InputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>,
  onClick: FormEventHandler<HTMLFormElement> | MouseEvent<HTMLElement>,
  value: string,
};

const Input = (props: InputProps) => {
  const { onChange, onClick, value } = props;

  return (
    <form className={styles.inputBox} onSubmit={onClick}>
      <input
        className={styles.input}
        type="text"
        placeholder="What is your goal?"
        onChange={onChange}
        value={value}
      />
      <button type="submit" className={styles.button}>
        Send
      </button>
    </form>
  );
 }

 export default Input;