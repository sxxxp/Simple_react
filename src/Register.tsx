import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookie,setCookie] = useCookies(["user"]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`http://192.168.49.2:30001/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("회원가입 실패");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("회원가입 성공:", data);
        setCookie("user",JSON.stringify(data), { path: "/" });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("회원가입 실패!");
      });
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">회원가입</button>
    </form>
  );
};

export default Register;
