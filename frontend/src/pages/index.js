import { useEffect, useState } from "react";
import Homepage from "./homepage";
import Login from "./login";
import { dataState } from "../../context";
export default function Home() {
  const {user} = dataState();
  if (user) {
    return (
        <Homepage />
    );
  } else {
    return <Login />;
  }
}
