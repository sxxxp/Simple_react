// src/pages/Home.tsx
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Home.css";

const Home = () => {
  const [cookies] = useCookies(["user"]);
  const { name } = cookies.user || { name: "로그인 안됨" };
  return (
    <div className="home-container">
      <div className="home-title">{name}</div>
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
