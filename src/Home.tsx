// src/pages/Home.tsx
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Home.css";
import { useEffect, useState } from "react";

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["nickname"]);
  const [name, setName] = useState<string>(cookies.nickname);
  const [inputValue, setInputValue] = useState<string>("");
  const setNickname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue) {
      setCookie("nickname", inputValue, { path: "/" });
      setName(inputValue);
    }
  };
  useEffect(() => {}, [name]);
  return (
    <div className="home-container">
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
