import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { useColorModeValue } from "@chakra-ui/react";;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  //const bgGradient = useColorModeValue('white', '#2d3748');
  const bg = 'linear(to-l, #7928CA, #FF0080)'

  const bgGradient = useColorModeValue(bg, '#2163d1');

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bgGradient={bgGradient}
      //bgGradient='linear(to-l, #7928CA, #FF0080)'
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
