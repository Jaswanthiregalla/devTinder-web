/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const user = useSelector((store) => store.user);

  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId.firstName,
        lastName: senderId.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();

    // socket.on("connect", () => {
    //   console.log("Socket Connected: ", socket.id);
    // });

    // socket.on("connect-error", (err) => {
    //   console.log("Connection Rejected: ", err.message);
    // });

    socket.on("disconnect", () => {
      setIsTargetOnline(false);
    });

    socket.on("onlineStatus", ({ statusUserId, isOnline }) => {
      if (statusUserId === targetUserId) {
        setIsTargetOnline(isOnline);
      }
    });

    // As soon as page loaded the socket connection is made and joinChat event emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      console.log(firstName + " : " + text);
      setMessages((prevMessage) => [
        ...prevMessage,
        { firstName, lastName, text, createdAt },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.on("chatError", (message) => {
      console.log(message);
    });
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600 text-center text-2xl font-bold">
        Chat
      </h1>

      <div className="flex-1 overflow-y-scroll p-5">
        {/* display messages */}
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header">
                <span>{`${msg.firstName} ${msg.lastName}`}</span>
                {user.firstName !== msg.firstName && (
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isTargetOnline ? "bg-green-600" : "bg-gray-400"
                    }`}
                  />
                )}

                <time className="text-xs opacity-50">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : ""}
                </time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-white bg-gray-600 rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
