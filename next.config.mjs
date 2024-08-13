import path from "path";
import withPlaiceholder from "@plaiceholder/next";
import { withPlausibleProxy } from "next-plausible";

// import withBundleAnalyzer from '@next/bundle-analyzer';
// const bundleAnalyzer = withBundleAnalyzer({
// 	enabled: process.env.ANALYZE === 'true',
// })
const isProd = process.env.NODE_ENV === "production";

const nextConfig =
  // module.exports =
  withPlausibleProxy({
    customDomain: "https://analytics.prototypr.io",
    domain: "4.prototypr.io",
    selfHosted: true,
  })({
    i18n: {
      locales: ["en-US", "es-ES"],
      defaultLocale: "en-US",
    },

    webpack: (config, options) => {
      if (!options.isServer) {
        //letter addition - graeme graylien change
        config.resolve.fallback.fs = false;
        config.resolve.fallback.net = false;
        config.resolve.fallback.tls = false;
        config.resolve.fallback.dns = false;
      }

      if (typeof config.webpack === "function") {
        return config.webpack(config, options);
      }
      return config;
    },
    //cache https://focusreactive.com/configure-cdn-caching-for-self-hosted-next-js-websites/#:~:text=Configuring%20Cloudflare%20CDN%20for%20the%20Next.&text=To%20configure%20HTML%20page%20caching,)%2C%20and%20Edge%20TTL%20section.
    async headers() {
      if (process.env.NODE_ENV !== "production") {
        return [];
      }
      return [
        {
          source: "/:all*(css|js|gif|svg|jpg|jpeg|png|woff|woff2)",
          locale: false,
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000",
            },
          ],
        },
      ];
    },
    // generation before timing out
    staticPageGenerationTimeout: 300000,
  });

// export default bundleAnalyzer(withPlaiceholder(nextConfig));
export default withPlaiceholder(nextConfig);
