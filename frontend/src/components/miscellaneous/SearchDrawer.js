import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Text,
  Input,
  VStack,
  HStack,
  Box,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { toaster, Toaster } from "../ui/toaster";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../../Context/chatProvider";

const SearchDrawer = ({ user }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toaster.create({
        title: "Error fetching chat",
        description: error.response.data.message,
        type: "error",
        duration: 3000,
      });
      setLoadingChat(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        description: "Please enter a valid search query",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data); // assuming `data` is the array of users
      setLoading(false);
    } catch (error) {
      toaster.create({
        description: "Something went wrong",
        type: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Drawer.Root placement="start">
        <Drawer.Trigger asChild>
          <Button
            variant="outline"
            color="black"
            bg="transparent"
            _hover={{ bg: "gray.200" }}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} fontSize="md" p="4">
              Search User
            </Text>
          </Button>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner padding="2">
            <Drawer.Content rounded="md">
              <Drawer.Header>
                <HStack spacing={2} w="full">
                  <Input
                    placeholder="Search User"
                    variant="outline"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    onClick={handleSearch}
                    variant="solid"
                    colorScheme="blue"
                  >
                    <i className="fas fa-search"></i>
                  </Button>
                  <Drawer.CloseTrigger asChild pos="initial">
                    <CloseButton />
                  </Drawer.CloseTrigger>
                </HStack>
              </Drawer.Header>

              <Drawer.Body>
                {loading ? (
                  <ChatLoading />
                ) : (
                  <VStack align="stretch" spacing={3}>
                    {searchResult.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))}
                  </VStack>
                )}
                {loadingChat && (
                  <Box pos="absolute" inset="0" bg="bg/80">
                    <Center h="full">
                      <Spinner borderWidth="4px" size="lg" />
                    </Center>
                  </Box>
                )}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Toaster />
    </>
  );
};

export default SearchDrawer;
