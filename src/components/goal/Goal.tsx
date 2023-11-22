import React, { ChangeEventHandler } from "react";
import styles from "./Goal.module.css";

type GoalProps = {
  id: string;
  status: boolean;
  msg: string;
  onCheckChange: ChangeEventHandler<HTMLElement>;
}

const Goal = (props: GoalProps) => {
  const { id, status, msg, onCheckChange } = props;

  return (
    <div className={styles.goalWrap}>
      <label
        className={status ? styles.textDisabled : styles.text}
        htmlFor={id}
      >
        {
          //2
          status && <div className={styles.clean} />
        }
        <input
          type="checkbox"
          id={id}
          name={id}
          data-msg={msg}
          onChange={onCheckChange}
          checked={status}
        />
      </label>
    </div>
  );
};

export default Goal;