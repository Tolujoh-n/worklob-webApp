import React, { useRef, useState, useEffect } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import MarkdownMessage from "./MarkdownMessage";
import "highlight.js/styles/github.css"; // or another theme

import logo from "../../assets/worklob-logo.png";

const Chatbot = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [file, setFile] = useState(null);
  const hiddenFileInput = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleAttachClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      handleFile(fileUploaded);
    }
  };

  const handleFile = (file) => {
    console.log("File uploaded name:" + file.name);
  };

  const handleUserMessage = async (userMessage) => {
    const newUserMessage = {
      message: userMessage,
      sender: "user",
      direction: "outgoing",
      error: false,
    };

    const updatedChatMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedChatMessages);
    setIsChatbotTyping(true);

    await processUserMessageForGoogle(updatedChatMessages);
  };

  async function processUserMessageForGoogle(messages) {
    let contents = messages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "user") {
        role = "user";
      } else {
        role = "model";
      }
      let msg = messageObject.message;
      return { role: role, parts: [{ text: msg }] };
    });

    const apiRequestBody = {
      contents,
    };

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          process.env.REACT_APP_GOOGLE_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );
      if (!response.ok || !response.body) {
        throw response.statusText;
      }

      const newStreamMessage = {
        message: "",
        sender: "model",
        direction: "incoming",
        error: false,
      };
      const chatMessagesWithResponse = [...messages, newStreamMessage];
      const latestModelMessageIndex = chatMessagesWithResponse.length - 1;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let loopRunner = true;

      while (loopRunner) {
        const { value, done } = await reader.read();
        if (done) {
          setIsChatbotTyping(false);
          break;
        }

        const decodedChunk = decoder.decode(value, { stream: true });
        const cleanedDecodedChunk = decodedChunk.replace(/^data:\s*/, "");
        let messagePart = "";
        let errorFlag = false;

        try {
          messagePart =
            JSON.parse(cleanedDecodedChunk).candidates[0].content.parts[0].text;
        } catch {
          messagePart = "Error retrieving results";
          errorFlag = true;
        }

        chatMessagesWithResponse[latestModelMessageIndex].message +=
          messagePart;
        if (errorFlag) {
          chatMessagesWithResponse[latestModelMessageIndex].error = true;
        }
        setChatMessages([...chatMessagesWithResponse]);
      }
    } catch (error) {
      console.log(error);
      setChatMessages([
        ...messages,
        {
          message: "Error retrieving message",
          sender: "model",
          direction: "incoming",
          error: true,
        },
      ]);
      setIsChatbotTyping(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUserMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div className="col-lg-12">
        <section className="section profile">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="">
                  <>
                    <section id="chat-section" className="chat-section">
                      <div className="container">
                        <div className="chat-window">
                          <div className="chat-messages">
                            {chatMessages.map((message, index) => (
                              <div
                                key={index}
                                className={`chat-message ${
                                  message.sender === "user"
                                    ? "user-message userai"
                                    : "ai-message"
                                }`}
                              >
                                <div style={{ display: "flex" }}>
                                  {message.sender === "model" && (
                                    <img
                                      style={{
                                        height: "30px",
                                        width: "30px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                        alignSelf: "flex-start",
                                      }}
                                      src={logo}
                                      alt="Logo"
                                    />
                                  )}
                                  <div>
                                    {message.error ? (
                                      <>
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                        <span>{message.message}</span>
                                      </>
                                    ) : (
                                      <MarkdownMessage
                                        content={message.message}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {isChatbotTyping && (
                              <div className="chat-message ai-message">
                                <TypingIndicator content="WorklobAI is thinking..." />
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                          <div className="text-center chat-input">
                            <button onClick={handleAttachClick}>
                              <i className="bi bi-paperclip"></i>
                            </button>
                            <input
                              type="text"
                              style={{ width: "100%" }}
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type your message..."
                            />
                            <button onClick={() => handleUserMessage(input)}>
                              <i className="bi bi-send"></i>
                            </button>
                          </div>
                          <p style={{ textAlign: "center", color: "gold" }}>
                            Note: Your chat will be cleared once you disconnect
                          </p>
                        </div>
                      </div>
                    </section>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={hiddenFileInput}
                      style={{ display: "none" }} // Make the file input element invisible
                    />
                  </>
                </div>
              </div>
            </div>
          </div>
          <style>{`
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 100%;
          margin: 0;
          padding-top: 10%;
          border: none;
          overflow: hidden;
        }

        .chat-messages {
          flex-grow: 1;
          overflow-y: auto;
          color: whitesmoke;
        }

        .chat-message {
          margin: 10px 0;
          padding: 10px 20px;
          border-radius: 20px;
          word-wrap: break-word;
        }

        .user-message {
          align-self: flex-end;
          background-color: #e2e3e5;
          color: #41464b;
          margin-left: 40%;
        }

        .ai-message {
          align-self: flex-start;
          background: transparent;
          color: whitesmoke;
          width: 100%;
        }

        .chat-input {
          align-items: center;
          padding: 10px;
          margin-bottom: 20px;
          width: 100%;
        }

        .chat-input input {
          flex-grow: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 20px;
          outline: none;
          padding-right: 40px;
        }

        .chat-input button {
          margin-left: -40px;
          border: none;
          background: none;
          cursor: pointer;
          color: #007bff;
          outline: none;
        }

        .chat-input button:hover {
          color: #0056b3;
        }

        .chat-input button svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
        </section>
      </div>
    </>
  );
};

export default Chatbot;
