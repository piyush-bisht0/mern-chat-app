import React from "react";
import { useEffect } from "react";
import { Container, Box, Text, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          ChatApp
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg">
        <Tabs.Root defaultValue="login" variant="plain">
          <Tabs.List p="0.5">
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="signup">Signup</Tabs.Trigger>
            <Tabs.Indicator rounded="2xl" />
          </Tabs.List>
          <Tabs.Content color="black" value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content color="black" value="signup">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
