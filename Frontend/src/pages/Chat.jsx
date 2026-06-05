import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../api/api";
import "../styles/chat.css";

// Base URL detection matching api.js
const isLocal = window.location.hostname === "localhost";
const serverURL = isLocal
  ? "http://localhost:5000"
  : "https://boi-para.onrender.com";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const socketRef = useRef(null);
  const messageStreamRef = useRef(null);
  const activeConversationRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const location = useLocation();

  // Keep references updated for the socket event callbacks to avoid closure traps
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // ==============================
  // 👤 INITIAL LOAD (USER & CONVERSATIONS)
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    // Load current user profile
    API.get("/api/auth/profile")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
      });

    // Load conversations list
    API.get("/api/conversations")
      .then((res) => {
        setConversations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
      });

    return () => {
      // Disconnect socket on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // ==============================
  // 🔗 AUTO-SELECT REDIRECTED CHAT
  // ==============================
  useEffect(() => {
    if (location.state?.selectConversation && currentUser && conversations.length > 0) {
      const matchingConv = conversations.find(c => c._id === location.state.selectConversation._id);
      if (matchingConv) {
        handleSelectConversation(matchingConv);
      } else {
        setConversations(prev => [location.state.selectConversation, ...prev]);
        handleSelectConversation(location.state.selectConversation);
      }
      // Clear history state to avoid re-selecting on page refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state, currentUser, conversations]);

  // ==============================
  // ⚡ SOCKET.IO CLIENT SETUP
  // ==============================
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    const socket = io(serverURL, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server ✅");
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("newMessage", (msg) => {
      const activeConv = activeConversationRef.current;
      const currentUserId = currentUser._id;

      // Update the conversations sidebar list (unread count and order)
      setConversations((prev) => {
        const updatedList = prev.map((c) => {
          if (c._id === msg.conversation) {
            const updated = {
              ...c,
              lastMessage: msg,
              updatedAt: new Date().toISOString()
            };

            const isCurrentActive = activeConv?._id === msg.conversation;
            const isOtherSender = msg.sender._id !== currentUserId;

            if (!isCurrentActive && isOtherSender) {
              const currentUnread = c.unreadCounts?.[currentUserId] || 0;
              updated.unreadCounts = {
                ...c.unreadCounts,
                [currentUserId]: currentUnread + 1
              };
            }
            return updated;
          }
          return c;
        });

        // Re-sort to put the active/newly updated chat at the top
        return [...updatedList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      // Append message to active chat message stream
      if (activeConv?._id === msg.conversation) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();

        // If it's a message from the other person, mark it as read on the backend
        if (msg.sender._id !== currentUserId) {
          API.put(`/api/conversations/${msg.conversation}/read`).catch(console.error);
        }
      }
    });

    socket.on("typingStatus", ({ conversationId, userId, isTyping }) => {
      const activeConv = activeConversationRef.current;
      if (activeConv?._id === conversationId && userId !== currentUser._id) {
        setOtherUserTyping(isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  // ==============================
  // 🔄 SELECT CONVERSATION
  // ==============================
  const handleSelectConversation = async (conversation) => {
    // If selecting the already active chat, do nothing
    if (activeConversation?._id === conversation._id) return;

    // Leave the old conversation channel if active
    if (activeConversation && socketRef.current) {
      socketRef.current.emit("leaveConversation", activeConversation._id);
    }

    setActiveConversation(conversation);
    setOtherUserTyping(false);

    // Join the new conversation channel
    if (socketRef.current) {
      socketRef.current.emit("joinConversation", conversation._id);
    }

    // Load messages history
    try {
      const res = await API.get(`/api/messages/${conversation._id}`);
      setMessages(res.data);
      scrollToBottom();

      // Reset unread count for current user locally in sidebar
      setConversations((prev) =>
        prev.map((c) => {
          if (c._id === conversation._id) {
            return {
              ...c,
              unreadCounts: {
                ...c.unreadCounts,
                [currentUser._id]: 0
              }
            };
          }
          return c;
        })
      );

      // Reset unread count on backend
      await API.put(`/api/conversations/${conversation._id}/read`);
    } catch (err) {
      console.error("Error loading conversation messages:", err);
    }
  };

  // ==============================
  // 📝 HANDLE TYPING INPUT & INDICATORS
  // ==============================
  const handleInputChange = (e) => {
    setNewMessageText(e.target.value);
    if (!socketRef.current || !activeConversation) return;

    // Emit typing status: true
    socketRef.current.emit("typing", {
      conversationId: activeConversation._id,
      isTyping: true
    });

    // Clear previous timeout and set a new one to turn off typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && activeConversationRef.current) {
        socketRef.current.emit("typing", {
          conversationId: activeConversationRef.current._id,
          isTyping: false
        });
      }
    }, 2000);
  };

  // ==============================
  // 🚀 SEND MESSAGE
  // ==============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConversation) return;

    const messageText = newMessageText.trim();
    setNewMessageText("");

    // Clear typing timeout and emit typing: false immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.emit("typing", {
        conversationId: activeConversation._id,
        isTyping: false
      });
    }

    try {
      await API.post("/api/messages", {
        conversationId: activeConversation._id,
        text: messageText
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ==============================
  // 📜 SCROLL UTILITY
  // ==============================
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageStreamRef.current) {
        messageStreamRef.current.scrollTop = messageStreamRef.current.scrollHeight;
      }
    }, 50);
  };

  // ==============================
  // Helper: Get other participant
  // ==============================
  const getOtherParticipant = (conversation) => {
    if (!currentUser || !conversation) return null;
    return conversation.participants.find(
      (p) => p._id.toString() !== currentUser._id.toString()
    );
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Inter" }}>
        <h3>Loading chat details...</h3>
      </div>
    );
  }

  const activeOtherUser = getOtherParticipant(activeConversation);
  const isOtherUserOnline = activeOtherUser && onlineUsers.includes(activeOtherUser._id);

  return (
    <div className="chat-container">
      {/* ==============================================
          📁 CONVERSATIONS SIDEBAR
          ============================================== */}
      <div className={`chat-sidebar ${activeConversation ? "hidden-mobile" : ""}`}>
        <div className="sidebar-header">
          <h2>Conversations</h2>
          <input
            type="text"
            placeholder="Search messages..."
            className="chat-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="conversation-list">
          {filteredConversations.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", marginTop: "20px", fontSize: "14px" }}>
              No conversations found.
            </p>
          ) : (
            filteredConversations.map((c) => {
              const other = getOtherParticipant(c);
              if (!other) return null;

              const isOnline = onlineUsers.includes(other._id);
              const unreadCount = c.unreadCounts?.[currentUser._id] || 0;
              const isActive = activeConversation?._id === c._id;

              return (
                <div
                  key={c._id}
                  className={`conversation-item ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectConversation(c)}
                >
                  <div className="avatar-wrapper">
                    {other.profileImage ? (
                      <img
                        src={`${serverURL}/uploads/${other.profileImage}`}
                        alt={other.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80";
                        }}
                      />
                    ) : (
                      <div className="avatar-placeholder">{getInitials(other.name)}</div>
                    )}
                    {isOnline && <div className="online-badge" />}
                  </div>

                  <div className="conversation-info">
                    <div className="conversation-top">
                      <span className="conversation-name">{other.name}</span>
                      <span className="conversation-time">
                        {c.lastMessage ? formatTime(c.lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    <div className="conversation-bottom">
                      <span className="last-message-preview">
                        {c.lastMessage ? c.lastMessage.text : "No messages yet"}
                      </span>
                      {unreadCount > 0 && <div className="unread-badge">{unreadCount}</div>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==============================================
          💬 ACTIVE CONVERSATION MESSAGE AREA
          ============================================== */}
      <div className={`chat-area ${!activeConversation ? "hidden-mobile" : ""}`}>
        {activeConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-user">
                {/* Back Button for mobile */}
                <button
                  className="chat-header-back-btn"
                  onClick={() => setActiveConversation(null)}
                >
                  &#8592;
                </button>
                <div className="avatar-wrapper" style={{ width: "40px", height: "40px" }}>
                  {activeOtherUser?.profileImage ? (
                    <img
                      src={`${serverURL}/uploads/${activeOtherUser.profileImage}`}
                      alt={activeOtherUser.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder" style={{ fontSize: "14px" }}>
                      {getInitials(activeOtherUser?.name)}
                    </div>
                  )}
                  {isOtherUserOnline && <div className="online-badge" />}
                </div>
                <div>
                  <h3 className="chat-header-name">{activeOtherUser?.name}</h3>
                  <p className={`chat-header-status ${isOtherUserOnline ? "online" : ""}`}>
                    {isOtherUserOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="message-stream" ref={messageStreamRef}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888", marginTop: "40px", fontSize: "14.5px" }}>
                  Say hello to start the conversation! 👋
                </div>
              ) : (
                messages.map((m) => {
                  const isSentByMe = m.sender._id === currentUser._id;
                  return (
                    <div
                      key={m._id}
                      className={`message-bubble ${isSentByMe ? "sent" : "received"}`}
                    >
                      <div>{m.text}</div>
                      <span className="message-time">{formatTime(m.createdAt)}</span>
                    </div>
                  );
                })
              )}

              {otherUserTyping && (
                <div className="typing-container">
                  <span className="typing-text">{activeOtherUser?.name} is typing</span>
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
            </div>

            <div className="message-input-area">
              <form className="message-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="message-input"
                  value={newMessageText}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="btn-send"
                  disabled={!newMessageText.trim()}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat-placeholder">
            <div className="no-chat-icon">💬</div>
            <h3>Your Inbox</h3>
            <p>Select a seller from a book detail page or click on an existing thread to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
