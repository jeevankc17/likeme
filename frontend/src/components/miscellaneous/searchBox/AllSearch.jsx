import React, { useState } from 'react'
import { useDisclosure } from "@chakra-ui/hooks";

import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { DrawerBody } from "@chakra-ui/modal";
import ChatLoading from "../../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import UserListItem from "../../userAvatar/UserListItem";
import axios from "axios";
import { ChatState } from "../../../Context/ChatProvider";
import { useToast } from "@chakra-ui/toast";

function AllSearch() {
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



  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


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



  return (
    <DrawerBody>

            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
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

export default AllSearch