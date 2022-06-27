import {
  ActionLink,
  Col,
  Container,
  Details,
  Fieldset,
  Panel,
  Row
} from "nhsuk-react-components";
import MultiChoiceInputField from "../../../forms/MultiChoiceInputField";

const TotpInstructions = () => {
  return (
    <>
      <Panel
        data-cy="installTotpPanel"
        label="Installing the Microsoft Authenticator App on your phone"
      >
        <Details>
          <Details.Summary data-cy="msAuthInfoSummary">
            More details
          </Details.Summary>
          <Details.Text>
            <p data-cy="msAuthInfoText">
              Below are instructions to help you install Microsoft Authenticator
              on your Android or iPhone but please choose any combination of
              Authenticator App and device you most prefer.
            </p>
          </Details.Text>
        </Details>
        <Panel
          label="Scan the QR Code with your phone"
          style={{ backgroundColor: "aliceblue" }}
          data-cy="scanQrPanel"
        >
          <Fieldset.Legend size="m" data-cy="scanQrHeader">
            Using the camera on your phone, scan a QR Code below to download the
            Microsoft Authenticator App.
          </Fieldset.Legend>
          <Container>
            <Row>
              <Col width="one-half">
                <img
                  data-cy="qrApple"
                  alt="Get it from the App store"
                  src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWHRpz?ver=9319&q=90&m=2&h=2147483647&w=2147483647&b=%23FFFFFFFF&aim=true"
                  style={{
                    height: 300,
                    width: 200,
                    marginBottom: 30
                  }}
                ></img>
              </Col>
              <Col width="one-half">
                <img
                  data-cy="qrAndroid"
                  alt="Get it from the Google Play store"
                  src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWHRpj?ver=90bf&q=90&m=2&h=2147483647&w=2147483647&b=%23FFFFFFFF&aim=true"
                  style={{
                    height: 300,
                    width: 200,
                    marginBottom: 30
                  }}
                ></img>
              </Col>
            </Row>
          </Container>
        </Panel>
        <Details style={{ marginBottom: 40 }}>
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
              If you need an alternative to a QR code then please click a link
              below to download an Authenticator App:
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
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1432944000&h=39686e6a537b2c44ff7ce60f6287e68f"
                      alt="Download on the App Store"
                      style={{
                        height: 90,
                        width: 175,
                        marginLeft: 12,
                        marginRight: 12
                      }}
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
                      alt="Get it on Google Play"
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      style={{
                        height: 89,
                        width: 200
                      }}
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
      </Panel>
    </>
  );
};

export default TotpInstructions;
