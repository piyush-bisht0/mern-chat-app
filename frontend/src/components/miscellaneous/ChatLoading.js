import { SkeletonText } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <SkeletonText noOfLines={14} spacing="4" mt="10px" mb="10px"></SkeletonText>
  );
};

export default ChatLoading;
