import styles from "./Auth.module.scss";

const AuthFooter = (): JSX.Element => {
  return (
    <div
      className={styles.footerDiv}
      style={{
        textAlign: "center",
        width: "100%",
        backgroundColor: "#005EB8",
        padding: "16px 0"
      }}
    >
      <p style={{ color: "white", margin: 0 }}>
        &copy; Health Education England
      </p>
    </div>
  );
};

export default AuthFooter;
