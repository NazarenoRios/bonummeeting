import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Meeting() {
  const { meetingId, userRole, userName, userLastname, userLanguage } =
    useParams();

  const domain = "bonum-meet.bonumcoaching.com"; // Cambia esto al dominio correcto
  const parentNode = useRef(null);
  const api = useRef(null);
  const navigate = useNavigate();

  const isCoachee = userRole === "coachee";

  const user = { name: "namee", lastname: "lastname", languages: ["es", "en"] };

  const [meetingStarted, setMeetingStarted] = useState(false); // Estado para controlar si la reunión ha comenzado

  // method to send msg to react native
  const sendMessage = (message) => {
    window.ReactNativeWebView.postMessage(message);
  };

  useEffect(() => {
    if (!meetingStarted) {
      // Evita que se vuelva a iniciar la reunión si ya ha comenzado
      parentNode.current.style.position = "fixed";
      parentNode.current.style.top = 0;
      parentNode.current.style.left = 0;
      parentNode.current.style.width = "100%";
      parentNode.current.style.height = "100%";
      parentNode.current.style.background = "rgba(0, 0, 0, 0.5)";
      parentNode.current.style.zIndex = 9999;
      parentNode.current.style.display = "flex";
      parentNode.current.style.justifyContent = "center";
      parentNode.current.style.alignItems = "center";

      const options = {
        roomName: `${meetingId}`,
        width: "100%",
        height: "100%",
        parentNode: parentNode.current,
        lang: userLanguage,
        userInfo: {
          displayName: `${userName} ${userLastname}`,
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableClosePage: false,
          buttonsWithNotifyClick: ["hangup", "hangup-menu"],
        },
        interfaceConfigOverwrite: { end_conference: false },
      };

      api.current = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener("videoConferenceJoined", () => {
        sendMessage("START_CALL");
      });

      api.current.addEventListener("participantJoined", (event) => {
        if (isCoachee) {
          api.current.executeCommand("grantModerator", event.id);
        }
      });

      api.current.addEventListener("toolbarButtonClicked", (e) => {
        if (isCoachee) {
          return;
        }

        const buttonPressed = e.key;

        if (buttonPressed === "hangup-menu" || buttonPressed === "hangup") {
          api.current.executeCommand("hangup");
          api.current.executeCommand("endConference");
          sendMessage("END_CALL");
        }
      });

      api.current.addEventListener("readyToClose", () => {
        sendMessage("EVALUATE_SESSION");
      });

      setMeetingStarted(true);
    }
  }, [meetingId, meetingStarted, navigate, isCoachee, user, domain]);

  return <div ref={parentNode}></div>;
}

export default Meeting;
