import useUser from "@/lib/iron-session/useUser";
import UserMenu from "@/components/Navbar/UserMenu";
import Link from "next/link";
import LocationMenu from "@/components/Navbar/parts/LocationMenu";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/Primitives/Navigation";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import MobileActiveLink from "@/components/Navbar/parts/MobileActiveLinkApp";
import NavSponsor from "../v4/badge/NavSponsor";
import SearchModal from "../SearchModal";
import MenuItems from "@/components/Navbar/parts/MenuItemsApp";
import NewPostDialog from "./parts/NewPostDialog";

const Navbar = ({
  collapsed,
  hideLocaleSwitcher,
  editor,
  sponsor,
  showWriteButton,
  maxWidth,
  navType,
  navBackground,
  sessionUser,
}) => {
  const { user, isLoading } = useUser({
    redirectIfFound: false,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const [isVisible, setVisible] = useState(false);
  const [blinkyOn, setBlinkyOn] = useState(false);

  useEffect(() => {
    setBlinkyOn(true);
    setTimeout(() => {
      setBlinkyOn(false);
    }, 1000);
  }, [isVisible]);

  useEffect(() => {
    const scrollListener = () => {
      // Remove getScrollPercent functionality
      // const p = getScrollPercent(); // Removed
      // Update visibility based on scroll position
      // if (p > 1) { // Removed
      //   setVisible(true);
      // } else { // Removed
      //   setVisible(false);
      // }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 ${navType == "full" ? "" : "md:top-2"}  w-full`}
        style={{ zIndex: 99 }}
      >
        <div
          className={`w-full ${navType == "full" ? "bg-white border-b border-gray-200 " : `${isVisible ? "bg-white bg-opacity-[88%] shadow-sm md:w-[50rem] lg:w-[62rem]" : "md:w-[97%] "}  md:rounded-2xl p-1`} transition-all duration-700 search-wide ${
            navType == "full"
              ? "max-w-full"
              : maxWidth
                ? maxWidth
                : "max-w-[1020px]"
          }  backdrop-blur-lg mx-auto p-1 px-1 pl-4`}
        >
          <div
            className={`${maxWidth ? maxWidth : "max-w-[1020px]"} mx-auto relative flex h-9 items-center justify-between`}
          >
            <div className="flex flex-shrink-0 items-center">
              {/* mobile menu button */}
              <div className=" inset-y-0 mr-2 flex items-center xl:hidden">
                <button
                  type="button"
                  onClick={toggleMobileNav}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>

                  {mobileNavOpen ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
              <Link href="/" as="/">
                <>
                  <img
                    className={`xl:hidden transition-all duration-1000 h-8 w-auto`}
                    src="/static/images/logo-small.svg"
                    alt="Prototypr Logo"
                  />
                  <img
                    className={`xl:block ${isVisible ? "w-[25px] object-left-top object-cover drop-shadow-md" : "object-cover object-left-top w-[109px]"} transition-all duration-1000 hidden h-7 w-auto `}
                    src={`/static/images/prototypr_logo.svg`}
                    alt="Prototypr Logo"
                  />
                </>
              </Link>
              {/* lil cursor blinker */}
              <div
                className={`${blinkyOn ? "animate-pulse" : "opacity-0"} h-[28px] bg-gray-500/70 w-[2px]`}
              ></div>
              <div className="">
                <SearchModal />
              </div>
            </div>
            <div className="flex items-center h-9">
              <div className="hidden sm:ml-6 lg:block">
                <MenuItems locale={false} />
              </div>
            </div>
            <div
              className={`items-center sm:static sm:inset-auto flex ${
                user?.isLoggedin || sessionUser ? "" : "lg:mr-0"
              }`}
            >
              <NavigationMenu className="relative flex justify-center w-auto z-10">
                <NavigationMenuList className="flex justify-center p-[4px] ronded-[6px] list-none">
                  <LocationMenu
                    user={user}
                    sessionUser={sessionUser}
                    hideLocaleSwitcher={hideLocaleSwitcher}
                    collapsed={collapsed}
                    showWriteButton={showWriteButton}
                  />
                </NavigationMenuList>
              </NavigationMenu>
              <div className="relative">
                <UserMenu
                  userLoading={false}
                  user={user}
                  sessionUser={sessionUser}
                />
              </div>
              {sponsor ? <NavSponsor sponsor={sponsor} /> : null}
              <div>&nbsp;</div>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`xl:hidden ${
            !mobileNavOpen
              ? "h-0 overflow-hidden"
              : "mx-3 border border-gray-100 mt-1 bg-white shadow-lg"
          } rounded-xl`}
          id="mobile-menu"
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            <MobileActiveLink href={"/"}>Home</MobileActiveLink>
            <MobileActiveLink href={"/toolbox"}>Toolbox</MobileActiveLink>
            <MobileActiveLink href={"/topics"}>Topics</MobileActiveLink>
            <MobileActiveLink href={"/people"}>People</MobileActiveLink>
            {!user?.isLoggedIn ? (
              <MobileActiveLink href={"/onboard"}>Sign in</MobileActiveLink>
            ) : (
              ""
            )}
            {user?.isLoggedIn || sessionUser ? (
              <div className="px-2.5 pt-2" onClick={toggleMobileNav}>
                <NewPostDialog />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
