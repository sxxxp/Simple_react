import React, { useEffect, useRef, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import "./Chat.css";
import { IUser } from "./User";

const rooms = [
  { id: "1", name: "💬 일반 채팅방" },
  { id: "2", name: "🔥 익명 토론방" },
  { id: "3", name: "🎮 게임 채팅방" },
  { id: "4", name: "📚 공부 채팅방" },
  { id: "5", name: "😄 수다 채팅방" },
  { id: "6", name: "🎶 음악 채팅방" },
];
type Method = "join" | "exit" | "send";

interface Message {
  type: Method;
  message: string;
  user: IUser;
  time: Date;
}
const MessageTime = (time: string) => {
  const [year, month, date, hour, minute, second, millisecond] =
    time.split(":");
  const messageDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(date),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
    parseInt(millisecond)
  );
  return messageDate;
};
const DateMessage = (time: Date) => {
  const hour = time.getHours().toString().padStart(2, "0");
  const minute = time.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
};
const ChangeDate = (time: Date) => {
  const year = time.getFullYear().toString().padStart(4, "0");
  const month = (time.getMonth() + 1).toString().padStart(2, "0");
  const date = time.getDate().toString().padStart(2, "0");
  return `${year}년 ${month}월 ${date}일`;
};
const ChatMessage = ({ message }: { message: Message }) => {
  const [cookies] = useCookies(["user"]);
  const isOwn = message.user === cookies.user || message.user.name === "게스트";
  if (message.user.name === "[system]") {
    if (message.message === "") {
      return (
        <div className="system-message">
          <span className="timestamp">{ChangeDate(message.time)}</span>
        </div>
      );
    }
    return (
      <div className="system-message">
        <span>
          {message.message}{" "}
          <span className="timestamp">{DateMessage(message.time)}</span>
        </span>
      </div>
    );
  }
  return (
    <div className={`chat-message ${isOwn ? "own" : "other"}`}>
      <img
        src={
          isOwn
            ? "https://randomuser.me/api/portraits/men/32.jpg"
            : "https://randomuser.me/api/portraits/women/79.jpg"
        }
        alt="avatar"
        className="avatar"
      />
      <div className="message-content">
        <div className="message-info">
          <span className="username">{message.user.name}</span>
          <span className="timestamp">{DateMessage(message.time)}</span>
        </div>
        <div className="message-bubble">{message.message}</div>
      </div>
    </div>
  );
};
const CompareDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [cookie] = useCookies(["user"]);
  const [user, setUser] = useState<IUser>({
    name: "게스트",
    email: "",
    image: "",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  const room = rooms.find((r) => r.id === id);
  const WS_URL = `ws://localhost:4000/ws/` + id;

  // const unloadFunc = (e: BeforeUnloadEvent) => {
  //   e.preventDefault();
  //   socketRef.current?.send(messageFormat("exit", user, "퇴장"));
  //   socketRef.current?.close();
  //   socketRef.current = null;
  // };
  // useBeforeUnload(unloadFunc);
  const getTime = () => {
    const date = new Date();
    const y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");
    const ms = date.getMilliseconds().toString().padStart(3, "0");
    return `${y}:${M}:${d}:${h}:${m}:${s}:${ms}`;
  };

  const messageFormat = (type: Method, user: IUser, message: string) => {
    return `{"type":"${type}","user":"${user}","message":"${message}","time":"${getTime()}"}`;
  };

  useEffect(() => {
    // if (socketRef.current) {
    //   console.log("🟡 기존 WebSocket 연결이 존재합니다.",console.log(socketRef.current));
    //   return;
    // }

    if (!room) {
      navigate("/404");
    }
    if (cookie.user) setUser(cookie.user);

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket 연결됨");
      socketRef.current = socket;
      socket.send(
        messageFormat(
          "join",
          { name: "[system]", email: "", image: "" },
          `${user!.name} 입장`
        )
      );
    };

    socket.onmessage = (event) => {
      event.data.split("\n").forEach((msg: string) => {
        if (msg === "") return;
        try {
          let raw_message = JSON.parse(msg);
          raw_message.time! = MessageTime(raw_message.time);
          const message: Message = raw_message;
          setMessages((prev) => {
            if (prev.length === 0) {
              const msg: Message = {
                type: "send",
                message: "",
                user: { name: "[system]", email: "", image: "" },
                time: message.time,
              };
              return [msg, message];
            }
            if (!CompareDate(prev[prev.length - 1].time, message.time)) {
              const msg: Message = {
                type: "send",
                message: "",
                user: { name: "[system]", email: "", image: "" },
                time: message.time,
              };
              return [...prev, msg, message];
            }
            return [...prev, message];
          });
        } catch (e) {
          console.log("메시지 원본:", msg);
          console.error("메시지 파싱 오류:", e);
        }
      });
    };

    socket.onclose = () => {
      socketRef.current = null;
      console.log("❌ WebSocket 연결 종료");
    };

    socket.onerror = (e) => {
      console.log();
      console.error(e);
    };

    return () => {
      socket.close();
    };
  }, []);

  // 스크롤 자동 아래로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current) {
      alert("서버와 연결이 끊겼습니다.");
      return;
    }
    if (input.trim()) {
      socketRef.current.send(messageFormat("send", user, input));
      setInput("");
    }
  };

  const exitChat = () => {
    if (socketRef.current) {
      socketRef.current.send(
        messageFormat(
          "exit",
          { name: "[system]", email: "", image: "" },
          `${user} 퇴장`
        )
      );
      socketRef.current.close();
      socketRef.current = null;
    }

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     type: "exit",
    //     message: "👋 유저님이 채팅을 떠났습니다.",
    //     user: "[system]",
    //     time: getTime(),
    //   },
    // ]);
    navigate("/chat");
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        {room?.name}{" "}
        <button className="exit-button" onClick={exitChat}>
          나가기
        </button>
      </div>
      <div className="chat-body" ref={scrollRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default Chat;
