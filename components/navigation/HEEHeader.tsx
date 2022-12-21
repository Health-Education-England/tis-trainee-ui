import { useState } from "react";
import { Header } from "nhsuk-react-components";
import Navbar from "./Navbar";
import HEEHeaderLogo from "./HEEHeaderLogo";
import styles from "./HEEHeader.module.scss";
import SantaSwitch from "react-switch";
import Snowfall from "react-snowfall";
interface HEEHeaderProps {
  signOut: any;
  mfa: string;
}

const HEEHeader = ({ signOut, mfa }: HEEHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const updateMenuStatus = (open: boolean) => {
    setShowMenu(open);
  };

  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  const iconStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: "18px"
  };

  return (
    <Header className={styles.header}>
      <Header.Container>
        <HEEHeaderLogo />
        <Header.Content>
          <div className={styles.btnDiv}>
            <Header.MenuToggle
              className={`nhsuk-header__menu-toggle ${
                showMenu ? "closeMenu" : ""
              }`}
              onClick={() => setShowMenu(!showMenu)}
              data-cy="BtnMenu"
            />
          </div>
          <div className={styles.santaSwitchDiv}>
            <SantaSwitch
              onChange={handleChange}
              checked={checked}
              offColor="#2D8CDC"
              checkedIcon={
                <div style={iconStyle}>
                  <span role="img" aria-label="father Christmas checked icon">
                    🎅
                  </span>
                </div>
              }
              uncheckedHandleIcon={
                <div style={iconStyle}>
                  <span role="img" aria-label="cry emoji unchecked">
                    😢
                  </span>
                </div>
              }
              checkedHandleIcon={
                <div style={iconStyle}>
                  <span role="img" aria-label="happy emoji checked">
                    😁
                  </span>
                </div>
              }
            />
          </div>
          {checked ? (
            <Snowfall
              style={{
                position: "fixed",
                width: "100vw",
                height: "100vh"
              }}
            />
          ) : null}
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
