import React from "react";
import { StoryPage } from "@/components/StoryPage";
import { LoadingScreen } from "@/components/LoadingScreen";

type Props = {};

const page = (props: Props) => {
  /* return <StoryPage />; */
  return <LoadingScreen />;
};

export default page;
