import Head from "next/head";
import {
  ActionLink,
  Button,
  Card,
  Col,
  Footer,
  Header,
  Hero,
  InsetText,
  Row
} from "nhsuk-react-components";

const SITE_URL = "https://trainee.tis.nhs.uk";
// Only the production site should be indexed by search engines.
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

export default function Landing() {
  return (
    <>
      <Head>
        <title>
          TIS Self-Service | Online service for doctors and dentists in training
        </title>
        <meta
          name="description"
          content="TIS Self-Service (TSS) is the online service for doctors and dentists in training in England to view their placement and programme details, sign their Conditions of Joining and submit forms such as Form R."
        />
        <meta
          name="robots"
          content={IS_PRODUCTION ? "index,follow" : "noindex,nofollow"}
        />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:title" content="TIS Self-Service" />
        <meta
          property="og:description"
          content="The online service for NHS doctors, dentists, and public health professionals in training in England to manage their training information."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
      </Head>
      <Header
        service={{
          href: "/",
          text: "TIS Self-Service"
        }}
      />
      <Hero>
        <Hero.Heading data-cy="landingHeading">
          Welcome to TIS Self-Service
        </Hero.Heading>
        <Hero.Text data-cy="landingSubHeading">
          Your post-graduate training programme resource
        </Hero.Text>
      </Hero>
      <main className="nhsuk-width-container nhsuk-u-margin-top-5">
        <Row>
          <Col width="two-thirds">
            <p data-cy="landingBodyText">
              TIS Self-Service (TSS) is provided by NHS England for doctors,
              dentists, and public health professionals in postgraduate
              training. Our goal is to improve your training experience by
              making TIS Self-Service a one-stop-shop for your training-related
              admin tasks.
            </p>
            <div className="nhsuk-u-margin-bottom-4">
              <Button
                href="/sign-in"
                className="nhsuk-u-margin-right-3"
                data-cy="landingSignInBtn"
              >
                Sign in
              </Button>
              <Button secondary href="/sign-up" data-cy="landingSignUpBtn">
                Create an account
              </Button>
            </div>
          </Col>
        </Row>
        <h2 className="nhsuk-heading-m">
          What can I do after signing into TIS Self-Service?
        </h2>
        <Card.Group>
          <Card.GroupItem width="one-third">
            <Card data-cy="landingCardDetails">
              <Card.Heading className="nhsuk-heading-s">
                Keep track of your training details
              </Card.Heading>
              <Card.Description>
                View your placements, training programmes and the personal
                details held about you on the Trainee Information System (TIS).
              </Card.Description>
            </Card>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <Card data-cy="landingCardForms">
              <Card.Heading className="nhsuk-heading-s">
                Complete and submit your training-related forms{" "}
              </Card.Heading>
              <Card.Description>
                Sign your Conditions of Joining agreement, complete ARCP / new
                starter forms (e.g. Form R), submit a Less than full-time
                training request.
              </Card.Description>
            </Card>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <Card data-cy="landingCardActions">
              <Card.Heading className="nhsuk-heading-s">
                Check your training TO-DO Actions and notifications
              </Card.Heading>
              <Card.Description>
                Keep track of the actions you need to complete for your training
                programme, and view your notifications (which includes viewing
                copies of email notifications from the TIS team)
              </Card.Description>
            </Card>
          </Card.GroupItem>
        </Card.Group>
        <ActionLink
          href="https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/"
          target="_blank"
          rel="noopener noreferrer"
          data-cy="landingWhatsNewLink"
        >
          See what&apos;s new in TIS Self-Service
        </ActionLink>
        <h2 className="nhsuk-heading-m">Help and support</h2>
        <Row>
          <Col width="two-thirds">
            <p>
              If you have a question about using the service, please read the{" "}
              <a
                href="https://tis-support.hee.nhs.uk/trainees/"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="landingFaqLink"
              >
                TIS Self-Service support FAQs
              </a>
              .
            </p>
            <p>
              Still having issues? Email{" "}
              <a
                href="mailto:england.tis.support@nhs.net"
                data-cy="landingSupportEmailLink"
              >
                england.tis.support@nhs.net
              </a>{" "}
              with your GMC/GDC/PH number and a brief description of the
              problem.
            </p>
          </Col>
        </Row>
        <InsetText data-cy="landingBetaText">
          <p>
            We are in the Private Beta phase of delivery so expect more features
            soon.
          </p>
        </InsetText>
      </main>
      <Footer>
        <Footer.List>
          <Footer.ListItem href="https://tis-support.hee.nhs.uk/about-tis/">
            About
          </Footer.ListItem>
          <Footer.ListItem href="https://www.hee.nhs.uk/about/privacy-notice">
            Privacy &amp; Cookies Policy
          </Footer.ListItem>
        </Footer.List>
        <Footer.Copyright>
          &copy; {new Date().getFullYear()} NHS England
        </Footer.Copyright>
      </Footer>
    </>
  );
}
