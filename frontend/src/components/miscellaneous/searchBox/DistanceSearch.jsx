import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";

import { Input } from "@chakra-ui/input";
import { DrawerBody } from "@chakra-ui/modal";
import ChatLoading from "../../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import UserListItem from "../../userAvatar/UserListItem";
import axios from "axios";
import { ChatState } from "../../../Context/ChatProvider";
import { useToast } from "@chakra-ui/toast";
import { Box } from "@chakra-ui/layout";



function DistanceSearch() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);



  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { onClose } = useDisclosure();




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

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      // eslint-disable-next-line
      console.log(status)
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
                    toast({
                      title: "Error searching the user",
                      description: error.message,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                      position: "bottom-left",
                    });
                  };
        
      
    }
    };



  return (
    <DrawerBody>

            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={getLocation}>Go</Button>
            </Box>


            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <>
                {console.log(user)}
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
                </>
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
  )
}

export default DistanceSearch