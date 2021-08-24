import { useState } from "react";
import { Header } from "nhsuk-react-components";
import Navbar from "./Navbar";
import HEEHeaderLogo from "./HEEHeaderLogo";

import styles from "./HEEHeader.module.scss";
import { AuthState } from "@aws-amplify/ui-components";

interface HEEHeaderProps {
  authState: AuthState | undefined;
  user: any;
}

const showHeaderDefault = () => {
  return (
    <Header.Container>
      <HEEHeaderLogo />
    </Header.Container>
  );
};

const HEEHeader = ({ authState, user }: HEEHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const updateMenuStatus = (open: boolean) => {
    setShowMenu(open);
  };
  return (
    <Header className={styles.header}>
      {authState === AuthState.SignedIn ? (
        <>
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
            user={user}
          />
        </>
      ) : (
        showHeaderDefault()
      )}
    </Header>
  );
};

export default HEEHeader;
