import React from "react";
import styles from "./FormR.module.scss";

interface InputFooterLabelProps {
  label: string;
}

const InputFooterLabel: React.FC<InputFooterLabelProps> = ({ label }) => (
  <>
    {label && (
      <div className={styles.inputFooterLabel} data-cy="inputFooterLabel">
        {label}
      </div>
    )}
  </>
);

export default InputFooterLabel;
