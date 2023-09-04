import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Meeting() {
  // listener to receive msgs from react native
  useEffect(() => {
    const messageListener = window.addEventListener(
      "message",
      (nativeEvent) => {
        console.log("YAHALLO WEB");
      }
    );
    return messageListener;
  }, []);

  // method to send msg to react native
  const sendMessage = () => {
    window.ReactNativeWebView.postMessage("Hi from PWA");
  };

  return (
    <div className="App">
      <header>
        <h1>My App Header</h1>
      </header>
      <button onClick={sendMessage}>{`Say Hi`}</button>
    </div>
  );
}

export default Meeting;
