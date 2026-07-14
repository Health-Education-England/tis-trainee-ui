import styles from "../../Auth.module.scss";

export const AuthFooter = (): JSX.Element => {
  return (
    <footer className={styles.authFooterLinks}>
      <a
        className={styles.authFooterLink}
        href="https://tis-support.hee.nhs.uk/about-tis/"
        target="_blank"
        rel="noopener noreferrer"
      >
        About
      </a>

      <a
        className={styles.authFooterLink}
        href="https://www.hee.nhs.uk/about/privacy-notice"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy & Cookies
      </a>

      <span className={styles.authFooterText}>
        © NHS England {new Date().getFullYear()}
      </span>
    </footer>
  );
};
