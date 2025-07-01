// components/ScrollableChat.js
import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const ScrollableChat = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <Box ref={scrollRef} overflowY="auto" height="100%" px={2}>
      {children}
    </Box>
  );
};

export default ScrollableChat;
