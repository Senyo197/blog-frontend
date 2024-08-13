import Meta from "./meta";
// import Navbar from "../Navbar/Navbar";
import Navbar, { HomePageNewNavBar } from "@/components/Navbar/Navbar";
import Footer from "./footer";
import { NAV_OFFSET } from "@/lib/constants";

export default function Layout({
  preview,
  children,
  activeNav,
  background,
  padding,
  seo,
  navType,
  maxWidth,
  sponsor
}) {
  return (
    <>
      <Meta seo={seo} />
      {/* <Navbar activeNav={activeNav} /> */}
      <div className="fixed w-full z-50">
        <Navbar maxWidth={maxWidth} sponsor={sponsor}/>
      </div>

      <div
        className={`min-h-screen overflow-x-hidden md:overflow-x-visible  ${padding == false ? "" : "px-3 md:px-8"}`}
        style={{ background: background ? background : "#fbfcff" }}
      >
        <main
          className={`mx-auto ${NAV_OFFSET} overflow-hidden `}
          //   style={{ maxWidth: padding == false ? "" : "1200px" }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
