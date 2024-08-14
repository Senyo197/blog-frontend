import dynamic from "next/dynamic";
import Layout from "@/components/new-index/layoutForIndex";
import IntroBanner from "@/components/v4/hero/IntroBanner2";

const Footer = dynamic(() => import("@/components/footer"));

import {
  getCombinedPostsForHome,
  getAllToolsForHome,
  getCommonQuery,
  getAllNews,
} from "@/lib/api";
import { useIntl } from "react-intl";
import { transformPostListOld } from "@/lib/locale/transformLocale";

import NewsletterSection from "@/components/v4/section/NewsletterSection";
import { makeAuthorList, shuffleArray } from "@/lib/utils/postUtils";
import useUser from "@/lib/iron-session/useUser";
import TagsNavRow from "@/components/v4/section/TagsNavRow";
import Container from "@/components/container";
import TwoColumnCards from "@/components/v4/layout/TwoColumnCardsB";
import { TAB_ITEMS } from "@/lib/constants";
import HeroArticleSection from "@/components/v4/section/HeroArticleSection";
import CardColumn from "@/components/v4/layout/CardColumn";
import NewsColumn from "@/components/v4/layout/NewsColumn";
import { groupPostsByDate } from "@/lib/utils/groupPostsByDate";
import { createB64WithFallback } from "@/lib/utils/blurHashToDataURL";
import getSponsors from "@/lib/utils/getSponsors";

export default function Index({
  preview,
  allTools,
  topicRes,
  sponsors,
  navSponsor,
  heroPost,
  morePosts,
  allNews,
  groupedNewsPosts,
}) {
  const intl = useIntl();

  const titleText = intl.formatMessage({ id: "index.header.title" });
  const descriptionText = intl.formatMessage({ id: "intro.description" });

  const { user } = useUser({
    redirectIfFound: false,
  });

  const toolsList = allTools;

  return (
    <>
      <Layout
        sponsor={navSponsor}
        navOffset={false}
        padding={false}
        preview={preview}
        background={"#fbfcff"}
        seo={{
          title: titleText,
          description: descriptionText,
          image: "",
          canonical: "https://prototypr.io",
          url: "https://prototypr.io",
        }}
      >
        {!user?.isLoggedIn ? (
          <IntroBanner sponsor={sponsors?.length ? sponsors[0] : null} />
        ) : (
          <div className="pt-[44px]" />
        )}
        <div className="relative z-50 pt-6">
          <TagsNavRow />
        </div>
        <Container
          padding={false}
          maxWidth="max-w-[1320px] mx-auto px-3 md:px-3 xl:px-3 z-30 relative"
        >
          <div className="grid gap-3 grid-cols-9 md:grid-cols-9 xl:grid-cols-12 auto-rows-min">
            <div className="order-3 md:order-1 mt-6 md:mt-0 col-span-9 md:col-span-3">
              <NewsColumn
                groupedNewsPosts={groupedNewsPosts}
                sponsor={navSponsor}
                withBackground={false}
                posts={allNews}
              />
            </div>

            <div className="order-2 md:order-2 col-span-9 md:col-span-6 ">
              <h3 className="md:hidden mt-6 mb-3 font-bold drop-shadow-sm text-xl tracking-[-0.018em] text-gray-800">
                New Posts
              </h3>
              <HeroArticleSection
                user={user}
                cols={2}
                heroCardPost={heroPost}
                viewablePosts={morePosts}
                showSmallCardDescription={false}
                showBigPost={3}
                showTitle={false}
                showHeadingRow={false}
              />
            </div>
            <div className="order-1 mt-3 md:mt-0 md:order-3 col-span-9 md:col-span-9 xl:col-span-3">
              <CardColumn
                sponsor={navSponsor}
                withBackground={false}
                tools={toolsList ? [...toolsList.slice(0, 8)] : []}
              />
            </div>
          </div>
        </Container>

        <div className="mt-10">
          <NewsletterSection />
        </div>
        <div className="mt-14 py-4 pb-[100px] bg-[#f2f4fa]">
          {toolsList?.length > 0 ? (
            <ToolsCarouselSection toolsList={toolsList} sponsors={sponsors} />
          ) : null}
        </div>

        <div className="z-50 py-10 relative px-3">
          <HeroArticleSection
            user={user}
            cols={4}
            heroCardPost={morePosts?.length > 3 ? morePosts[4] : null}
            viewablePosts={
              morePosts?.length > 5
                ? morePosts.slice(5, morePosts.length)
                : null
            }
            showBigPost={2}
            showTitle={false}
          />
        </div>

        <Container maxWidth="py-16 pt-14  bg-[#ffffff]">
          <div className="max-w-[1320px] mx-auto">
            <TwoColumnCards />
          </div>
        </Container>
      </Layout>
      <Footer />
    </>
  );
}

export async function getStaticProps({ preview = null, locale }) {
  let sort = ["featured:desc", "tier:asc", "date:desc"];
  if (locale == "es-ES") {
    sort = ["esES:desc", "featured:desc", "tier:asc", "date:desc"];
  }

  let allPosts = (await getCombinedPostsForHome(preview, 12, 0, sort)) || [];

  let toolCount = 20;
  let allTools =
    (await getAllToolsForHome(preview, toolCount, 0, [
      "featured:desc",
      "date:desc",
    ])) || [];

  for (var x = 0; x < allTools?.data?.length; x++) {
    allTools.data[x].attributes.logoBase64 = createB64WithFallback(
      allTools.data[x]?.attributes?.logo?.data?.attributes?.blurhash
    );
    allTools.data[x].attributes.base64 = createB64WithFallback(
      allTools.data[x]?.attributes?.featuredImage?.data?.attributes?.blurhash
    );
  }

  let allNews = (await getAllNews(preview, 15, 0)) || [];

  let topicRes = {};
  for (let index = 0; index < TAB_ITEMS.length; index++) {
    const tag = TAB_ITEMS[index].slug;
    let res =
      (await getCommonQuery(preview, [tag], "article", 12, 0, sort)) || [];

    for (var x = 0; x < res?.data?.length; x++) {
      res.data[x].attributes.base64 = createB64WithFallback(
        res.data[x]?.attributes?.featuredImage?.data?.attributes?.blurhash
      );
    }

    const topicToolsRes =
      (await getCommonQuery(
        preview,
        [TAB_ITEMS[index].toolSlug],
        "tool",
        8,
        0,
        sort
      )) || [];

    const authors = makeAuthorList(res);
    shuffleArray(res.data);
    shuffleArray(authors);
    shuffleArray(topicToolsRes.data);

    for (var x = 0; x < topicToolsRes?.data?.length; x++) {
      topicToolsRes.data[x].attributes.logoBase64 = createB64WithFallback(
        topicToolsRes.data[x]?.attributes?.logo?.data?.attributes?.blurhash
      );
      topicToolsRes.data[x].attributes.base64 = createB64WithFallback(
        topicToolsRes.data[x]?.attributes?.featuredImage?.data?.attributes
          ?.blurhash
      );
    }

    const topicData = {
      authors: authors,
      posts: res.data,
      tools: topicToolsRes.data,
    };
    topicRes[tag] = topicData;
  }

  allPosts = transformPostListOld(allPosts.data, locale);
  allTools = transformPostListOld(allTools.data, locale);

  for (var x = 0; x < allPosts?.length; x++) {
    allPosts[x].attributes.base64 = createB64WithFallback(
      allPosts[x]?.attributes?.featuredImage?.data?.attributes?.blurhash
    );
  }

  allTools = formatAllTools({ tools: allTools, tagNumber: 1 });
  allNews = formatAllTools({ tools: allNews.data, tagNumber: 0 });

  const { navSponsor, sponsors } = await getSponsors();

  let groupedNewsPosts = groupPostsByDate(allNews);

  return {
    props: {
      heroPost: allPosts?.length ? allPosts[0] : null,
      morePosts: allPosts?.length > 1 ? allPosts.slice(1) : null,
      allTools: allTools?.length ? allTools : null,
      allNews: allNews?.length ? allNews : null,
      groupedNewsPosts: groupedNewsPosts ? groupedNewsPosts : null,
      topicRes: topicRes ? topicRes : null,
      preview,
      sponsors: sponsors?.length ? sponsors : [],
      navSponsor,
    },
    revalidate: 20,
  };
}
