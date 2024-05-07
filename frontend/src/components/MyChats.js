import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";
const ENDPOINT = process.env.API_PATH;
var socket;
const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [socketConnected, setSocketConnected] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
 const handleJoin = async (selectedChat) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { data } = await axios.put(
    `/api/chat/groupadd`,
    {
      chatId: selectedChat._id,
      userId: loggedUser._id,
    },
    config
  );
  socket.emit("join new room", {chat: selectedChat, user: loggedUser});
  toast({
    title: "Join Room",
    description: "You successfully joined the room",
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });
  setFetchAgain(!fetchAgain)

 }
 const handleDelete = async (chat) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios.delete("/api/chat/" + chat._id, config);
    setFetchAgain(!fetchAgain)
    toast({
      title: "Deleted Room",
      description: "You successfully deleted the room",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  } catch (error) {
    console.log(error, "This is the error")
  }

 }

 const handleSelectChat = (chat) => {
  if (chat.users.some(user => user._id === loggedUser._id)){
    setSelectedChat(chat)
  } else {
    handleJoin(chat)
    setSelectedChat(chat)
    toast({
      title: "Join Room",
      description: "You successfully joined the room",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
 }

 console.log(chats, "chats")
 const loggedUser = JSON.parse(localStorage.getItem("userInfo"))
  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Rooms
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Room
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
      <Stack overflowY="scroll">
      {chats.map((chat) => (
        <Box
          onClick={() => handleSelectChat(chat)}
          cursor="pointer"
          bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
          color={selectedChat === chat ? "white" : "black"}
          px={3}
          py={2}
          borderRadius="lg"
          key={chat._id}
          display="flex"
          justifyContent="space-between" // Aligns the buttons to the end
          alignItems="center" // Aligns items vertically centered
        >
          <div>
            <Text>
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </Text>
            {(chat.latestMessage  && !chat.latestMessage.isPrivate ) ?  (
              <Text fontSize="xs">
                <b>{chat.latestMessage.sender.name} : </b>
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content}
              </Text>
            ) : 'private message...'}
          </div>
          <div>
          {
         (loggedUser && !chat.users.some(user => user._id === loggedUser._id)) ? (
              <Button
                variant="outline"
                mr={2}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoin(chat);
                }}
              >
                Join
              </Button>
            ) : null
          }
       
            {
              loggedUser._id === chat.groupAdmin._id ? (
                <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(chat);
                }}
              >
                Delete
              </Button>
              ): null
            }

          </div>
        </Box>
      ))}
    </Stack>
    
       
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
