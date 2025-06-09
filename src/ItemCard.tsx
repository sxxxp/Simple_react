import React from "react";
import "./Item.css"; // 스타일 분리
import NotFound from "./NotFound";
interface Item {
  name: string;
  image: string;
  description: string;
  price: number;
  tradeable: boolean;
}
const ItemCard = ({ item }: { item: Item | undefined }) => {
  if (item === undefined) {
    return <NotFound />;
  }
  return (
    <div className="item-card">
      <div className="item-name">{item.name}</div>
      {item.image ? (
        <img src={item.image} alt={item.name} className="item-image" />
      ) : (
        <div className="item-placeholder">No Image</div>
      )}
      <div className="item-description">{item.description}</div>
      <div className="item-meta">
        <span className="meta-label">Price:</span> {item.price} G<br />
        <span className="meta-label">Tradeable:</span>{" "}
        {item.tradeable ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default ItemCard;
