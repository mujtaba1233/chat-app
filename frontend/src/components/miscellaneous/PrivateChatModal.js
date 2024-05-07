import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input,
    useToast,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "../../Context/ChatProvider";
  
  const PrivateChatModal = ({ isOpen, onClose, socket, privateSender, messages, setMessages }) => {
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const [privateMessage, setPrivateMessage] = useState();

    const toast = useToast();
  
    const { user, selectedChat } = ChatState();
  
    const handleSubmit = async () => {
 
            try {
              onClose()
              const config = {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              };
              setPrivateMessage("");
              const { data } = await axios.post(
                "/api/message",
                {
                  content: privateMessage,
                  isPrivate: true, 
                  privateUserId: privateSender._id,
                  chatId: selectedChat._id,
                },
                config
              );
              setMessages([...messages, data]);

              socket.emit("new message", data);
            } catch (error) {
                console.log(error, "This is the error")
              toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            }
    };
  
    return (
      <>  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Private Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Private Message"
                  mb={3}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Send Message
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default PrivateChatModal;
  