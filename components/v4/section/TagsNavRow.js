import Container from "@/components/container";
import GiantTag from "../tag/GiantTag";
import {Compass} from '@/components/icons'
import { useEffect, useState } from "react";

const tags = (path)=>[
    {
      name: "Accessibility",
      link: `/${path?path:'topic'}/accessibility/page/1`,
      slug:"accessibility"
    },
    {
      name: "AI",
      link: `/${path?path:'topic'}/ai/page/1`,
      slug:"ai"
    },
    {
      name: "Branding",
      link: `/${path?path:'topic'}/branding/page/1`,
      slug:"branding"
    },
    {
      name: "Figma",
      link: `/${path?path:'topic'}/figma/page/1`,
      slug:"figma"
    },
    {
      name: "Notion",
      link: `/${path?path:'topic'}/notion/page/1`,
      slug:"notion"
    },
    {
      name: "Interview",
      link: `/${path?path:'topic'}/interview/page/1`,
      slug:"interview"
    },
    {
      name: "Open Source",
      link: `/${path?path:'topic'}/open-source/page/1`,
      slug:"open-source"
    },
    {
      name: "Psychology",
      link: `/${path?path:'topic'}/design-psychology/page/1`,
      slug:"psychology"
    },
    {
      name: "UI",
      link: `/${path?path:'topic'}/ui/page/1`,
      slug:"ui"
    },
    {
      name: "UX",
      link: `/${path?path:'topic'}/ux/page/1`,
      slug:"ux"
    },
    {
      name: "User Research",
      link: `/${path?path:'topic'}/user-research/page/1`,
      slug:"user-research"
    },
    // {
    //   name: "Web Monetization",
    //   link: `/${path?path:'topic'}/web-monetization/page/1`,
    // },
    {
      name: "Career",
      link: `/${path?path:'topic'}/career/page/1`,
      slug:"career"
    },
  ];

const TagsNavRow = ({currentPage, activeTag, path}) => {

  const [orderedTags, setOrderedTags] = useState(()=>tags(path))

  useEffect(()=>{
    let reordered = orderTags(tags(path), activeTag, path)
    setOrderedTags(reordered)
  },[activeTag, currentPage])

  return (
    <Container padding={false} maxWidth={"max-w-[1320px] mx-auto mb-4 px-3 md:px-3"}>
        {/* browse all */}
        <div key={activeTag} className="flex flex-wrap gap-2">
        <GiantTag classes={`${currentPage=='topics'?'border border-gray-800':''} pl-2 mr-3`} link={`/topics`}>
          <div className="flex">
          <Compass weight={`${currentPage=='topics'?'fill':'regular'}`} size={24} />
            <div className="ml-2 my-auto">Explore topics</div>
          </div>
        </GiantTag>
          {orderedTags?.map((tag, index) => {
            return <GiantTag active={activeTag==tag?.slug} link={`${tag?.link || "/"}`}>{tag?.name}</GiantTag>;
          })}
        </div>
    </Container>
  );
};
export default TagsNavRow;

//function to order the tags array with the active tag first
const orderTags = (tags, activeTag, path) => {
  let taglies = [...tags]
  if(!activeTag) return tags;
  let activeTagIndex = taglies.findIndex((tag) => tag?.slug == activeTag);
  let activeTagObject = taglies[activeTagIndex];

  //create tag if it doesn't exist in the tags array
  if(!activeTagObject){
    const name = activeTag.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    activeTagObject = {name:name, link:`/${path?path:'topic'}/${activeTag}/page/1`, slug:activeTag}
  }
  taglies.splice(activeTagIndex, 1);
  taglies.unshift(activeTagObject);
  return taglies;
};
