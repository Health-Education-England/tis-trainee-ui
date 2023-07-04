import Script from "next/script";

declare let ChatBotUiLoader: any;

const Chatbot = () => {
  const isEnabled = process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "true";
  const baseUrl = process.env.NEXT_PUBLIC_CHATBOT_BASE_URL;

  return isEnabled ? (
    <Script
      id="chatbot"
      src={`${baseUrl}/lex-web-ui-loader.min.js`}
      onLoad={() => {
        const loaderOpts = {
          baseUrl: baseUrl,
          shouldLoadMinDeps: true
        };
        const loader = new ChatBotUiLoader.IframeLoader(loaderOpts);
        const chatbotUiConfig = {};
        loader.load(chatbotUiConfig).catch((error: any) => {
          console.error(error);
        });
      }}
    />
  ) : (
    <></>
  );
};

export default Chatbot;
