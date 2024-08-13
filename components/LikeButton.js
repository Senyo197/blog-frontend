import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";

import { getLikeCount } from "@/lib/api";
import toast from "react-hot-toast";

const LikeButton = ({ post, user }) => {
  const [userLikeObject, setUserLikeObject] = useState(null);

  const [likeCount, setLikeCount] = useState(post?.attributes?.likeCount);

  const refetchLikeCount = async (post, user) => {
    const lc = await getLikeCount(post?.id);
    if (lc?.post?.data?.attributes?.likeCount) {
      setLikeCount(lc?.post?.data?.attributes?.likeCount);
    }
    if (lc?.post?.data?.attributes?.likes?.data) {
      const likeObject = lc?.post?.data?.attributes?.likes?.data?.find(
        like => like?.attributes?.user?.data?.id == user?.id
      );
      if (likeObject) {
        setUserLikeObject(likeObject);
        const { like, love, fire, unicorn } = likeObject.attributes;
        setReactions({
          like,
          love,
          fire,
          unicorn,
        });
      } else {
        setUserLikeObject(null);
        setReactions({
          like: false,
          love: false,
          fire: false,
          unicorn: false,
        });
      }
    }
    // setLikeCount(likeCount);
  };

  const [reactions, setReactions] = useState({
    like: false,
    love: false,
    fire: false,
    unicorn: false,
  });

  const [creatingLike, setCreatingLike] = useState(false);

  useEffect(() => {
    const updateLikes = async () => {

      const likeObject = post.attributes?.likes?.data?.find(
        like => like?.attributes?.user?.data?.id == user?.id
      );
      if (likeObject) {
        setUserLikeObject(likeObject);
        const { like, love, fire, unicorn } = likeObject.attributes;
        setReactions({
          like,
          love,
          fire,
          unicorn,
        });
      } else {
        setUserLikeObject(null);
        setReactions({
          like: false,
          love: false,
          fire: false,
          unicorn: false,
        });
      }

      await refetchLikeCount(post, user);

    };
    updateLikes();
  }, [user, post]);

  const debounceSave = useCallback(
    debounce(async (post, newReactions, total, userLikeObject, user, type) => {
      if (!user?.isLoggedIn) {
        return false;
      }
      if (type == "update") {
        // Your axios call here, using newReactions
        let entry = {
          total: total,
          ...newReactions,
          // slug: slug, //slug is always the same when editing a draft - so we don't need to update it
        };

        let updatePostEndpointConfig = {
          method: "put",
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/likes/${userLikeObject.id}`,
          headers: {
            Authorization: `Bearer ${user?.jwt}`,
          },
          data: {
            data: {
              ...entry,
            },
          },
        };

        try {
          const updateData = await axios(updatePostEndpointConfig);
          console.log("saved");
          refetchLikeCount(post, user);
        } catch (e) {
          refetchLikeCount(post, user);
          toast("Error liking post", {
            duration: 5000,
            icon: "💔",
          });
        }
      } else if (type == "create") {
        setCreatingLike(true);
        //create a new like object
        let entry = {
          total: total,
          ...newReactions,
          user: user?.id,
          post: post?.id,
        };

        let createPostEndpointConfig = {
          method: "post",
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/likes?post=${post?.id}`,
          headers: {
            Authorization: `Bearer ${user?.jwt}`,
          },
          data: {
            data: {
              ...entry,
            },
          },
        };

        try {
          const publishData = await axios(createPostEndpointConfig);
          setUserLikeObject(publishData.data.data);
          setCreatingLike(false);
          console.log("created");
          refetchLikeCount(post, user);
        } catch (e) {
          setCreatingLike(false);
          refetchLikeCount(post, user);
          toast("Error liking post", {
            duration: 5000,
            icon: "💔",
          });
        }
      }
    }, 2000),
    [getLikeCount]
  );

  const handleReaction = async reaction => {
    /**
     * logged out user toggle animation and show toast
     */
    if (!user?.isLoggedIn) {
      if(creatingLike){
        return false
      }
      setCreatingLike(true)
      let addLike = reactions[reaction] ? false : true;
      let newReactions = { ...reactions, [reaction]: addLike };

      let newLikeCountObj = { ...likeCount };
      newLikeCountObj[reaction] = newLikeCountObj[reaction] + 1;
      newLikeCountObj.total = likeCount.total+1;

      setLikeCount(newLikeCountObj);

      if (reactions) {
        setReactions({ ...newReactions });
      }

      setTimeout(() => {
        addLike = reactions[reaction] ? true : false;
        newReactions = { ...reactions, [reaction]: addLike };
        if (reactions) {
          setReactions({ ...newReactions });
        }

        let newLikeCountObj = { ...likeCount };
        newLikeCountObj[reaction] = newLikeCountObj[reaction];
        newLikeCountObj.total = likeCount.total;
        setLikeCount(newLikeCountObj);
        setCreatingLike(false)
      }, 800);
      toast("Sign in to react to posts.", {
        duration: 5000,
        icon: "💔",
      });

      return false;
    }

    const addLike = reactions[reaction] ? false : true;

    const newReactions = { ...reactions, [reaction]: addLike };
    if (reactions) {
      setReactions({ ...newReactions });
    }
    let newLikeCountObj = { ...likeCount };
    newLikeCountObj[reaction] = addLike
      ? newLikeCountObj[reaction] + 1
      : newLikeCountObj[reaction] - 1;
    // const totalLikes = Object.values(newReactions).reduce(
    //   (total, reaction) => total + (reaction ? 1 : 0),
    //   0
    // );
    // newLikeCountObj.total = totalLikes;
    newLikeCountObj.total = addLike? likeCount.total + 1: likeCount.total - 1;
    setLikeCount(newLikeCountObj);

    try {
      //for each reaction, if it is true, add 1 to a total
      let total = 0;
      for (const key in newReactions) {
        if (newReactions[key]) {
          total++;
        }
      }

      if (userLikeObject) {
        debounceSave(post, newReactions, total, userLikeObject, user, "update");
      } else {
        const newReactions = { ...reactions, [reaction]: addLike };
        if (reactions) {
          setReactions({ ...newReactions });
        }
        debounceSave(post, newReactions, total, userLikeObject, user, "create");
      }

      // Toggle the liked state
    } catch (error) {
      console.log(error);
      alert("error saving like");
      console.error("Error updating post like:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="rounded-full h-fit w-fit p-2.5 flex flex-col gap-2 bg-gray-100/90">
      <div
        className={`${likeCount?.total > 0 ? "h-6 my-2" : "opacity-0 h-0"} text-gray-600  tracking-tight font-semibold text-center transition transition-all duration-400 cursor-default`}
      >
        <span className="mr-[2px]">❤️</span> {likeCount?.total}
      </div>
        <button
          disabled={creatingLike}
          onClick={() => handleReaction("like")}
          className={`${reactions.like ? "shadow-lg bg-white" : "bg-white/40"} group rounded-full p-1 h-12 w-14  flex flex-col justify-center`}
        >
          <div
            className={`${reactions.like ? "opacity-100 text-[26px] drop-shadow-lg" : "text-[22px] opacity-80 group-hover:opacity-100"} transition transition-all duration-400 mx-auto flex gap-2`}
          >
            😍{" "}
            {likeCount?.like > 0 ? (
              <div
                className={`${reactions.like ? "text-gray-700" : "text-gray-500"} text-sm my-auto`}
              >
                {likeCount?.like}
              </div>
            ) : null}
          </div>
        </button>
        <button
          disabled={creatingLike}
          onClick={() => handleReaction("unicorn")}
          className={`${reactions.unicorn ? "shadow-lg bg-white" : "bg-white/40"} group rounded-full p-1 h-12 w-14  flex flex-col justify-center`}
        >
          <div
            className={`${reactions.unicorn ? "opacity-100 text-[26px] drop-shadow-lg" : "text-[22px] opacity-80 group-hover:opacity-100"} transition transition-all duration-400 mx-auto flex gap-2`}
          >
            🦄{" "}
            {likeCount?.unicorn > 0 ? (
              <div
                className={`${reactions.unicorn ? "text-gray-700" : "text-gray-500"} text-sm my-auto`}
              >
                {likeCount?.unicorn}
              </div>
            ) : null}
          </div>
        </button>
        <button
          disabled={creatingLike}
          onClick={() => handleReaction("fire")}
          className={`${reactions.fire ? "shadow-lg bg-white" : "bg-white/40"} group rounded-full p-1 h-12 w-14  flex flex-col justify-center`}
        >
          <div
            className={`${reactions.fire ? "opacity-100 text-[26px] drop-shadow-lg" : "text-[22px] opacity-80 group-hover:opacity-100"} transition transition-all duration-400 mx-auto flex gap-2`}
          >
            🔥{" "}
            {likeCount?.fire > 0 ? (
              <div
                className={`${reactions.fire ? "text-gray-700" : "text-gray-500"} text-sm my-auto`}
              >
                {likeCount?.fire}
              </div>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
};

export default LikeButton;
