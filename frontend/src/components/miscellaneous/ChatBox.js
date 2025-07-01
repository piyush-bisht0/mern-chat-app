// src/components/ChatBox.js
import React from "react";
import { Box } from "@chakra-ui/react";
import SingleChat from "./singleChat";

const ChatBox = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      h="100%" // full height of parent
      overflow="hidden"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
