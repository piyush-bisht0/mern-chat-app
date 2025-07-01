import { Box, Button, Text, Menu, Portal } from "@chakra-ui/react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import ProfileDialog from "./ProfileDialog";
import { useHistory } from "react-router-dom";
import SearchDrawer from "./SearchDrawer";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setUser } = ChatState();

  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null); // Clear user context state
    history.push("/");
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        bg="white"
        p="5px 10px"
        borderWidth="5px"
        alignItems="center"
      >
        <SearchDrawer user={user} />

        <Text fontSize="2xl" fontFamily="Work sans" color="black">
          ChatApp
        </Text>

        <Box display="flex" alignItems="center" gap="14px">
          <Menu.Root>
            <Menu.Trigger asChild>
              <FaBell fontSize="2xl" color="black" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner />
            </Portal>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                bg="transparent"
                _hover={{ bg: "gray.200" }}
              >
                <FaUserCircle color="black" />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item closeOnSelect={false}>
                    <ProfileDialog user={user} />
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      w="100%"
                      justifyContent="flex-start"
                      variant="ghost"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
