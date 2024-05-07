import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import React, { useState } from "react";
import PrivateChatModal from "./miscellaneous/PrivateChatModal";
// import { messages } from "../data/messages";

const ScrollableChat = ({ messages, socket, setMessages  }) => {
  const { user } = ChatState();
  const [show, setShow] = useState(false);
  const [privateSender, setPrivateSender] = useState();
  const handlePrivateMessage = (message) => {
    setShow(true);
    setPrivateSender(message.sender)
  }
  return (
<ScrollableFeed>
  {messages &&
    messages.map((m, i) => (
      <React.Fragment key={m._id}>
        <div style={{ display: m.isPrivate  ? 'none' :"flex" }}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
            onDoubleClick={() => handlePrivateMessage(m)}
          >
            {m.content}
          </span>
        </div>
        {/* Additional check to render private messages */}
        {m.isPrivate && (m.privateUserId === user._id || m.sender._id === user._id) && (         
          <div title="Private message" style={{ display: "flex" }} key={`${m._id}-private`}>
           {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
            {/* Display sender avatar here if needed */}
            <span
              style={{
                backgroundColor: "lightgrey",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            {/* <span style={{ fontSize: "small" }}>Private Message</span> */}
          </div>

        )}
      </React.Fragment>
    ))}
    {
      show  && <PrivateChatModal messages={messages} setMessages={setMessages} privateSender={privateSender} isOpen={true} socket={socket}  onClose={() => {setShow(false)}}/>
    }
</ScrollableFeed>

  );
};

export default ScrollableChat;
