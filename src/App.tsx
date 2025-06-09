import React from "react";
import Chat from "./Chat";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import ChatList from "./Chatlist";
import { CookiesProvider } from "react-cookie";
import Login from "./Login";
import Register from "./Register";
import Item from "./Item";
function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
