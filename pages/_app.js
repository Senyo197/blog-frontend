import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";

import { useMemo } from "react";
// import "@/styles/index.scss";
import { SessionProvider } from "next-auth/react";
// import "@/styles/toolStyles.css";
import { SWRConfig } from "swr";
// import { LocaleProvider, LocaleContext } from '../context/LocaleContext';
// import LocaleAlert from "@/components/Locale/LocaleAlert";
import { IntlProvider } from "react-intl";
import EN from "../locales/en-US";
import ES from "../locales/es-ES";
import { useRouter } from "next/router";
import fetchJson from "@/lib/iron-session/fetchJson";

const TopProgressBar = dynamic(
  () => {
    return import("@/components/TopProgressBar");
  },
  { ssr: false }
);
const AppToaster = dynamic(
  () => {
    return import("@/components/AppToaster");
  },
  { ssr: false }
);

import "../styles/index.scss";
import "../styles/toolStyles.css";
// import PageViewTracker from "@/components/PageViewTracker";
// import MakerPopover from "@/components/maker/maker";

import { Inter } from "next/font/google";
const font = Inter({
  // weight: '400',
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  const { locale } = useRouter();

  const [shortLocale] = locale ? locale.split("-") : ["en"];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case "es":
        return ES;
      case "en":
        return EN;
      default:
        return EN;
    }
  }, [shortLocale]);

  return (
    <PlausibleProvider
      customDomain="https://analytics.prototypr.io"
      selfHosted={true}
      domain="4.prototypr.io"
    >
      <IntlProvider
        key={locale || "en-US"}
        defaultLocale="en-US"
        locale={locale || "en-US"}
        messages={messages}
      >
        <>
          <TopProgressBar />
          <SWRConfig
            value={{
              fetcher: fetchJson,
              onError: (err) => {
                console.error(err);
              },
            }}
          >
            <SessionProvider session={session} refetchInterval={5 * 60}>
              <div className={font.className}>
                <Component {...pageProps} />
              </div>
            </SessionProvider>
          </SWRConfig>
          <AppToaster />
        </>
      </IntlProvider>
    </PlausibleProvider>
  );
}

export default App;
