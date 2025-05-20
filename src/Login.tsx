import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookie] = useCookies(["user"]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:4000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert("로그인 실패!");
        return;
      }
      res.json().then((data) => {
        console.log("로그인 성공:", data);
        cookie.user = data
        navigate("/");
      });
    });
  };

  return (
    <form action="worker1/user/login" method="POST" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default Login;
