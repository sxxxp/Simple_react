// src/pages/Home.tsx
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Home.css";
import { useEffect, useState } from "react";

const Home = () => {
  const [cookies] = useCookies(["user"]);
  const [name, setName] = useState<string>("로그인 안됨");
  useEffect(() => {
    if (cookies.user.name) setName(cookies.user.name);
  }, [name, cookies]);
  return (
    <div className="home-container">
      <div className="home-title">{cookies.user.name}</div>
      <NavLink to={"/login"} className="chat-button">
        로그인 하러가기
      </NavLink>
      <NavLink to={"/register"} className="chat-button">
        회원가입 하러가기
      </NavLink>
      <NavLink to={"/chat"} className="chat-button">
        채팅하러가기
      </NavLink>
    </div>
  );
};

export default Home;
