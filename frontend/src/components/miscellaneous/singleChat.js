// src/components/SingleChat.js
import { Box, Text, Spinner, Input, Fieldset, Field } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import axios from "axios";
import io from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa";

import ScrollableChat from "../miscellaneous/ScrollableChat";
import { ChatState } from "../../Context/chatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import animationData from "../../animations/typing.json";
import { toaster } from "../ui/toaster";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Failed to Load Messages",
        description: error?.response?.data?.message || "An error occurred",
        type: "error",
        duration: 3000,
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        setNewMessage("");
        setMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
      } catch (error) {
        toaster.create({
          title: "Message Send Failed",
          description: error?.response?.data?.message || "An error occurred",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        if (!notification.some((n) => n._id === newMsg._id)) {
          setNotification([newMsg, ...notification]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  });

  if (!selectedChat) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
        w="100%"
        bg="white"
      >
        <Text fontSize="3xl" color="gray.700">
          Click on a user to start chatting
        </Text>
      </Box>
    );
  }

  const chatTitle = selectedChat.isGroupChat
    ? selectedChat.chatName
    : getSender(user, selectedChat.users);

  return (
    <Box
      display="flex"
      flexDirection="column"
      w={{ base: "100%", md: "68%" }}
      h="100%"
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      bg="white"
      borderColor="gray.300"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb={3}
      >
        <button
          onClick={() => setSelectedChat("")}
          style={{
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FaArrowLeft size={20} color="#2D3748" />
        </button>
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          {chatTitle.toUpperCase()}
        </Text>
      </Box>

      {/* Messages */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        overflow="hidden"
        borderRadius="md"
        bg="gray.100"
        px={2}
      >
        {loading ? (
          <Spinner size="xl" alignSelf="center" mt="auto" />
        ) : (
          <ScrollableChat>
            {messages.map((m) => (
              <Box
                key={m._id}
                alignSelf={
                  m.sender._id === user._id ? "flex-end" : "flex-start"
                }
                maxW="75%"
                bg={m.sender._id === user._id ? "blue.300" : "gray.300"}
                borderRadius="xl"
                px={4}
                py={2}
                my={1}
              >
                {selectedChat.isGroupChat && m.sender._id !== user._id && (
                  <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1}>
                    {m.sender.name}
                  </Text>
                )}
                <Text fontSize="md" color="gray.900">
                  {m.content}
                </Text>
              </Box>
            ))}
          </ScrollableChat>
        )}
      </Box>

      {/* Input */}
      <Fieldset.Root mt={3} onKeyDown={sendMessage}>
        <Fieldset.Content>
          {istyping && (
            <Lottie
              options={defaultOptions}
              width={60}
              style={{ marginBottom: 10 }}
            />
          )}
          <Field.Root>
            <Field.Label srOnly>Message</Field.Label>
            <Input
              placeholder="Enter a message..."
              variant="filled"
              bg="gray.200"
              color="gray.800"
              value={newMessage}
              onChange={typingHandler}
              _placeholder={{ color: "gray.600" }}
            />
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    </Box>
  );
};

export default SingleChat;
