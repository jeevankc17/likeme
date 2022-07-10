import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Box, Text } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "../components/ChatLoading";
import UserListItem from "../components/userAvatar/UserListItem";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
import { Input } from "@chakra-ui/input";
import { Tooltip } from "@chakra-ui/tooltip";


const Geoloc = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingChat, setLoadingChat] = useState(false);
   const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();
  const toast = useToast();
  console.log(status);

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // eslint-disable-next-line
  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      // eslint-disable-next-line
      //{console.log(status)};
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);           
        });
                try {
                  setLoading(true);
                    const config = {
                      headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                      },
                    };
                    const { data } =  await axios.post(
                      "/api/user/location",
                      {
                        lng,lat
                      },
                      config
                    );
                    setLoading(false);
                    setSearchResult(data);
                    console.log(data);
                          }catch (error) {
                    console.log("errorrrr");
                  };
        
      
    }
    };

 
  /*  <div className="GeolocationJS">
    <Button colorScheme='teal' size="md" onClick={getLocation}>Give Location</Button>
    </div>*/
     return (
       <><Tooltip label="Find Nearby Users" hasArrow placement="bottom-end">
         <Button variant="ghost" onClick={onOpen}>
           <i className="fas fa-search"></i>
           <Text d={{ base: "none", md: "flex" }} px={4}>
             Nearby Users
           </Text>
         </Button>
       </Tooltip><Drawer placement="left" onClose={onClose} isOpen={isOpen}>
           <DrawerOverlay />
           <DrawerContent>
             <DrawerHeader borderBottomWidth="1px">LOCATE USERS</DrawerHeader>
             <DrawerBody>
               <Box d="flex" pb={2}>
                 <Button colorScheme='teal' size="md" onClick={getLocation}>Find New Friends</Button>
               </Box>
               {loading ? (
                 <ChatLoading />
               ) : (
                 searchResult?.map((user) => (
                   <UserListItem
                     key={user._id}
                     user={user}
                     handleFunction={() => accessChat(user._id)} />
                 ))
               )}
               {loadingChat && <Spinner ml="auto" d="flex" />}
             </DrawerBody>
           </DrawerContent>
         </Drawer></>
)};

export default Geoloc;