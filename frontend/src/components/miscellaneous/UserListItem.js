import { Avatar, AvatarGroup, Box, HStack, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      _hover={{ fontStyle: "italic" }}
      w="100%"
      p={3}
      borderRadius="lg"
      transition="background 0.2s"
    >
      <HStack spacing={4}>
        <AvatarGroup>
          <Avatar.Root>
            <Avatar.Image src={user.pic} alt={user.name} />
            <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
          </Avatar.Root>
        </AvatarGroup>

        <Box>
          <Text fontWeight="semibold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default UserListItem;
