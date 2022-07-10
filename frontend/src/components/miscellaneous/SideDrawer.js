import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import ToggleColorMode from "../ToggleColorMode";
import { useColorModeValue } from "@chakra-ui/react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import AllSearch from "./searchBox/AllSearch";
import DistanceSearch from "./searchBox/DistanceSearch";

function SideDrawer() {


  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };



  const bg = useColorModeValue('white', '#2d3748');



  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        borderRadius='md'
        //bg="white"
        bg={bg}
        //bgGradient='linear(to-l, #7928CA, #FF0080)'

        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} fontWeight='bold' px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>


        <Text fontSize="2xl" fontFamily="Work sans" fontWeight='bold'>
          LikeMe
        </Text>
        <ToggleColorMode />
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem fontWeight='bold'>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} fontWeight='bold'>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent boxShadow='dark-lg' p='6' rounded='md' bg='white'>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab>All Search</Tab>
                <Tab>Geofencing Search</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AllSearch />
                </TabPanel>
                <TabPanel>
                  <DistanceSearch />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
