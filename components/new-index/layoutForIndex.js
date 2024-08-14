"use client";
import { NAV_OFFSET } from "@/lib/constants";
import Meta from "../meta";
import Navbar, { HomePageNewNavBar } from "@/components/Navbar/Navbar";

export default function Layout({
  preview,
  children,
  sponsor,
  activeNav,
  background,
  padding,
  seo,
  navType,
  navOffset,
  navBackground,
}) {
  return (
    <>
      <Meta seo={seo} />
      <Navbar
        background={navBackground}
        navType={navType}
        sponsor={sponsor}
        maxWidth={"max-w-[1320px]"}
      />
      {/* </div> */}

      <div
        className={`min-h-screen overflow-x-hidden ${navOffset == false ? "" : NAV_OFFSET} ${
          padding == false ? "" : "px-3 md:px-8"
        }`}
        style={{ background: background ? background : "#fbfcff" }}
      >
        <main
          className="mx-auto "
          //   style={{ maxWidth: padding == false ? "" : "1200px" }}
        >
          {children}
        </main>
      </div>
      {/* <Footer /> */}
    </>
  );
}
