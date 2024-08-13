import BigCard from "../card/BigCard/BigCardC";

// import SmallCard from "../card/SmallCard/SmallCardE";
import SmallPostsGroup from "./SmallPostGroupD";
import RSSTitle from "../text/RSSTitle";
const LargePostGrid = ({ largePost, smallPosts, showHeading, title }) => {
  let url = largePost?.attributes?.featuredImage?.data?.attributes?.url;
  const dummyAvatar = 'https://s3-us-west-1.amazonaws.com/tinify-bucket/%2Fprototypr%2Ftemp%2F1595435549331-1595435549330.png'
  const largeCoverImage = url
    ? url
    : largePost?.attributes?.legacyFeaturedImage?.mediaItemUrl?largePost?.attributes?.legacyFeaturedImage?.mediaItemUrl:dummyAvatar;

    let authorData = largePost?.attributes?.author?.data?.attributes
    let largePostAvatar = authorData?.avatar?.data?authorData?.avatar?.data?.attributes?.url:authorData?.legacyAvatar?authorData?.legacyAvatar:dummyAvatar
  return (
    <>
    {title!==false?<RSSTitle title={title}/>:''}
    <div className="flex flex-col lg:flex-row justify-between max-w-[1320px]">
      {/* <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-sm">
        <BigCard
          link={`/post/${largePost?.attributes?.slug}`}
          avatar={largePostAvatar}
          excerpt={largePost?.attributes?.excerpt}
          author={largePost?.attributes?.author?.data?.attributes}
          image={largeCoverImage}
          date={largePost?.attributes?.date}
          title={largePost?.attributes?.title}
          tags={largePost?.attributes?.tags?.data}
        />
      </div> */}
      <SmallPostsGroup smallPosts={smallPosts}/>
    </div>
    </>
  );
};
export default LargePostGrid;
