import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/miscellaneous/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatPage = () => {
  const { user, setUser } = ChatState();

  const history = useHistory();

  useEffect(() => {
    if (!user) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUser(userInfo);
      } else {
        history.push("/");
      }
    }
  }, [user, setUser, history]);

  return (
    <Box w="100%">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </Box>
  );
};

export default ChatPage;
