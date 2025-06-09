// src/pages/Home.tsx
import { useParams } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";

const Item = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [item, setItem] = useState<Item | undefined>();
  interface Item {
    name: string;
    image: string;
    description: string;
    price: number;
    tradeable: boolean;
  }
  useEffect(() => {
    fetch("/api/item/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        return setError("아이템을 찾지 못했어요!");
      }
      res.json().then((data: Item) => {
        return setItem(data);
      });
    });
  }, []);
  return (
    <div>
      <h3>{error}</h3>
      <ItemCard item={item} />
    </div>
  );
};

export default Item;
