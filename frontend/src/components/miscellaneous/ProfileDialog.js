import {
  Dialog,
  Button,
  Portal,
  Image,
  Text,
  Box,
  CloseButton,
} from "@chakra-ui/react";

const ProfileDialog = ({ user }) => {
  return (
    <Dialog.Root bg="transparent">
      {/* Trigger: shown in Menu.Item using asChild */}
      <Dialog.Trigger asChild>
        <Button w="100%" justifyContent="center" variant="ghost">
          My Profile
        </Button>
      </Dialog.Trigger>

      {/* Portal wraps the actual dialog */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6} borderRadius="md">
            <Dialog.CloseTrigger asChild>
              <CloseButton position="absolute" top={2} right={2} />
            </Dialog.CloseTrigger>

            <Dialog.Title fontSize="2xl" textAlign="center" mb={4}>
              {user.name}
            </Dialog.Title>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
            >
              <Image
                borderRadius="full"
                boxSize="100px"
                src={user.pic}
                alt={user.name}
              />
              <Text>{user.email}</Text>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileDialog;
