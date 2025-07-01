import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { Box, Text, Stack, useColorModeValue } from "@chakra-ui/react";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error fetching chats",
        description: error?.response?.data?.message || "Could not load chats",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user.token) {
      fetchChats();
    }
  }, [user]);

  const getSender = (users) =>
    users.find((u) => u._id !== loggedUser?._id)?.name || "Unknown";

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        fontWeight="bold"
        w="100%"
        textAlign="left"
        color="blackAlpha.700"
      >
        My Chats
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
      >
        {chats.length > 0 ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text fontWeight="medium" noOfLines={1}>
                  {chat.isGroupChat ? chat.chatName : getSender(chat.users)}
                </Text>
                <Text
                  fontSize="sm"
                  color={
                    selectedChat?._id === chat._id
                      ? "whiteAlpha.800"
                      : "gray.500"
                  }
                  noOfLines={1}
                >
                  {chat.latestMessage
                    ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`
                    : "No messages"}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text color="gray.400" align="center">
            No chats available
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
