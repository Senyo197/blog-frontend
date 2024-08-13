import useUser from "@/lib/iron-session/useUser";
import { getUserArticle, getSlugFromArticleId } from "@/lib/api";
import dynamic from "next/dynamic";
const EditorWrapper = dynamic(() => import("tiptypr/dist/EditorWrapper"), {
  ssr: false
});
// import 'tiptypr/dist/styles.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale-subtle.css';
import "react-datepicker/dist/react-datepicker.css";

/**
 * Write
 * used to create new post
 *
 * uses the 'new post' version of useLoad
 * /components/Editor/editorHooks/newPost/useLoad
 * this hook loads the editor with any content stored in local storage
 *
 * @returns
 */
export default function Write() {
  const { user, isLoading, mutateUser } = useUser({
    // redirectTo: '/account',
    redirectTo: "/onboard",
    redirectIfFound: false,
  });
  return (
    <>
      <EditorWrapper
        getUserArticle={getUserArticle}
        getSlugFromArticleId={getSlugFromArticleId}
        user={user}
        userLoading={isLoading}
        mutateUser={mutateUser}
      />
    </>
  );
}
