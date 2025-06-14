import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["user"]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/user/register`, {
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
          if (response.status === 409) {
            return setError("이미 사용중인 이름이 있거나 이메일이 있습니다.");
          } else {
            return setError("회원가입 실패");
          }
        } else {
          response.json().then((data) => {
            console.log("회원가입 성공:", data);
            setCookie("user", JSON.stringify(data), { path: "/" });
            navigate("/");
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("회원가입 실패");
      });
  };

  return (
    <form onSubmit={handleRegister} className={"auth-form"}>
      <h3>{error}</h3>

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
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        돌아가기
      </button>
    </form>
  );
};

export default Register;
