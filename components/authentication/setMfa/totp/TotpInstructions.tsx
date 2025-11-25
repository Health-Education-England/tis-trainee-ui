import {
  ActionLink,
  Card,
  Col,
  Container,
  Details,
  Fieldset,
  Legend,
  Row
} from "nhsuk-react-components";
import MultiChoiceInputField from "../../../forms/MultiChoiceInputField";
import styles from "../../../authentication/Auth.module.scss";

const TotpInstructions = () => {
  return (
    <Card cardType="feature" data-cy="installTotpPanel">
      <Card.Content>
        <Card.Heading>
          Installing the Microsoft Authenticator App on your phone
        </Card.Heading>
        <Details>
          <Details.Summary data-cy="msAuthInfoSummary">
            More details
          </Details.Summary>
          <Details.Text>
            <p data-cy="msAuthInfoText">
              Below are instructions to help you install Microsoft Authenticator
              on your Android phone or iPhone. Please note that Microsoft
              Athenticator works on mobile devices only (includes iPad).
            </p>
            <p>You can use any other Authenticator app if you prefer.</p>
          </Details.Text>
        </Details>
        <Card
          cardType="feature"
          data-cy="scanQrPanel"
          className={styles.panelBack}
        >
          <Card.Content>
            <Card.Heading>Scan the QR Code with your phone</Card.Heading>
            <Fieldset>
              <Legend size="m" data-cy="scanQrHeader">
                Using the camera on your phone, scan a QR Code below to download
                the Microsoft Authenticator App.
              </Legend>
            </Fieldset>
            <Container>
              <Row>
                <Col width="one-half">
                  <img
                    data-cy="qrApple"
                    alt="App Store (Apple) MS Authenticator QR Code"
                    src="https://support.microsoft.com/images/en-us/8d591290-28d1-4c5a-8392-bf7ebbb2875b"
                  ></img>
                  <p>App Store (Apple)</p>
                </Col>
                <Col width="one-half">
                  <img
                    data-cy="qrAndroid"
                    alt="Google Play store MS Authenticator QR Code"
                    src="https://support.microsoft.com/images/en-us/752f5229-e6bb-4ce8-8f48-d6d255212648"
                  ></img>
                  <p>Google Play store</p>
                </Col>
              </Row>
            </Container>
          </Card.Content>
        </Card>
        <Details className={styles.detailsAuthHelp}>
          <Details.Summary data-cy="moreHelpSummary">
            Need more help?
          </Details.Summary>
          <Details.Text data-cy="moreHelpText">
            <ActionLink
              data-cy="authGuideLink"
              target="_blank"
              rel="noopener noreferrer"
              href="https://tis-support.hee.nhs.uk/trainees/how-to-set-up-an-authenticator-app-on-your-phone/"
            >
              Click here for help installing the Microsoft Authenticator App on
              your phone (opens in a new tab/window)
            </ActionLink>
          </Details.Text>
          <Details.Text data-cy="altTotpDownloadText">
            <p>
              If you need an alternative to a QR code then please click a logo
              link below to download an Authenticator App:
            </p>
          </Details.Text>
          <Details.Text data-cy="altTotpDownloadLinks">
            <Container>
              <Row>
                <Col width="one-half">
                  <a
                    data-cy="appLinkApple"
                    href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458?itsct=apps_box_badge&amp;itscg=30200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className={styles.altDownloadApple}
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1432944000&h=39686e6a537b2c44ff7ce60f6287e68f"
                      alt="Download on the App Store"
                    />
                  </a>
                </Col>
                <Col width="one-half">
                  <a
                    data-cy="appLinkAndroid"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://play.google.com/store/apps/details?id=com.azure.authenticator&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                  >
                    <img
                      className={styles.altDownloadAndroid}
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    />
                  </a>
                </Col>
              </Row>
            </Container>
          </Details.Text>
        </Details>
        <MultiChoiceInputField
          data-cy="appInstalledNowCheck"
          id="appInstalledNow"
          type="checkbox"
          name="appInstalledNow"
          items={[
            {
              label: "I have successfully installed an Authenticator App.",
              value: true
            }
          ]}
        />
      </Card.Content>
    </Card>
  );
};

export default TotpInstructions;
