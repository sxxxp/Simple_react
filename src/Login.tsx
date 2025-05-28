import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [cookie, setCookie] = useCookies(["user"]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`http://localhost:51234/user/login`, {
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
        if (res.status === 401) {
          return setError("이메일 또는 비밀번호가 잘못되었습니다.");
        } else {
          return setError("로그인 실패");
        }
      }
      res.json().then((data: JSON) => {
        console.log("로그인 성공:", data);
        setCookie("user", JSON.stringify(data), { path: "/" });
        navigate("/");
      });
    });
  };

  return (
    <>
    <h3>{error}</h3>
    <form action={process.env.API_URL + "/user/login"} method="POST" onSubmit={handleLogin}>
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
  </>
    );
};

export default Login;
