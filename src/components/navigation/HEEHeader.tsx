import { useState } from "react";
import { Header } from "nhsuk-react-components";
import Navbar from "./Navbar";
import HEEHeaderLogo from "./HEEHeaderLogo";
import styles from "./HEEHeader.module.scss";
interface HEEHeaderProps {
  signOut: any;
  mfa: string;
}

const HEEHeader = ({ signOut, mfa }: HEEHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const updateMenuStatus = (open: boolean) => {
    setShowMenu(open);
  };

  return (
    <Header className={styles.header}>
      <Header.Container>
        <HEEHeaderLogo />
        <Header.Content>
          <Header.MenuToggle
            className={`nhsuk-header__menu-toggle ${
              showMenu ? "closeMenu" : ""
            }`}
            onClick={() => setShowMenu(!showMenu)}
            data-cy="BtnMenu"
          />
        </Header.Content>
      </Header.Container>
      <Navbar
        showMenu={showMenu}
        updateMenuStatus={updateMenuStatus}
        signOut={signOut}
        mfa={mfa}
      />
    </Header>
  );
};

export default HEEHeader;
