import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";
import io from "socket.io-client";
import { API_BASE } from "../lib/config";

import "./VideoCall.css";


const server_url = API_BASE;

let connections = {};

const peerConfigConnections = {
  iceServers: [
    { urls: "stun:stun.easybell.de:3478" },
    
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:global.relay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};


function attachLocalStreamToConnection(pc, stream) {
  if (!pc || !stream) return;
  const senders = pc.getSenders();
  stream.getTracks().forEach((track) => {
    const existingSender = senders.find(
      (sender) => sender.track && sender.track.kind === track.kind,
    );
    if (existingSender) {
      existingSender.replaceTrack(track).catch((e) => console.log(e));
    } else {
      pc.addTrack(track, stream);
    }
  });
}

export default function VideoCall() {
  let navigate = useNavigate();
  const { url: roomId } = useParams();

  
  const [accessState, setAccessState] = useState("checking");
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const res = await fetch(`${API_BASE}/api/room/${roomId}/access`, {
          credentials: "include",
        });
        const data = await res.json();

        if (cancelled) return;

        if (res.status === 401) {
          setAccessState("unauthorized");
          setAccessError("You need to be logged in to join this meeting.");
          return;
        }
        if (!res.ok || !data.authorized) {
          setAccessState("unauthorized");
          setAccessError(
            data.error === "Room not found"
              ? "This meeting doesn't exist or has been cancelled."
              : "You don't have access to this meeting. Only the host and accepted attendees can join."
          );
          return;
        }
        setAccessState("authorized");
      } catch (err) {
        console.error("Access check failed:", err);
        if (!cancelled) {
          setAccessState("error");
          setAccessError("Couldn't verify your access to this meeting. Please try again.");
        }
      }
    }

    if (roomId) checkAccess();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef(); // it is for our video and not othrs

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]); // on and offing of video

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setShowModal] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [askUsername, setAskUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  
  let [remoteNames, setRemoteNames] = useState({});

  let [permissionError, setPermissionError] = useState("");

  const screenTrackRef = useRef(null);

  
  let [connectionStatus, setConnectionStatus] = useState("connected");

  
  const hasConnectedOnceRef = useRef(false);

  

  const getpermission = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      //videopermission holds a mediastream object
      //navigator is browser object which has all things related to hardware and etc

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
      setPermissionError(
        "Camera/microphone access was blocked. Please allow camera and microphone permissions in your browser and reload the page.",
      );
    }
  };

  function connect() {
    setAskUsername(false);
    getMedia();
  }

  //TODO
  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

 
  let resetPeerConnections = () => {
    for (let id in connections) {
      try {
        connections[id].close();
      } catch (e) {
        console.log(e);
      }
    }
    connections = {};
    setVideos([]);
  };

  let connectToSocketServer = () => {
    

    socketRef.current = io.connect(server_url, {
      secure: true,
      
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current.on("signal", gotMessageFromServer);

    
    socketRef.current.on("user-left", (id) => {
      setVideos((videos) => videos.filter((video) => video.socketId !== id));
      setRemoteNames((prevNames) => {
        const updatedNames = { ...prevNames };
        delete updatedNames[id];
        return updatedNames;
      });
    });

    socketRef.current.on("user-joined", (id, clients, usernamesMap) => {
      if (usernamesMap) {
        setRemoteNames((prevNames) => ({ ...prevNames, ...usernamesMap }));
      }

      clients.forEach((socketListId) => {
       
        if (
          socketListId === socketIdRef.current ||
          connections[socketListId]
        ) {
          return;
        }

       
        connections[socketListId] = new RTCPeerConnection(
          peerConfigConnections,
        );
        

        connections[socketListId].onicecandidate = (event) => {
          
          if (event.candidate !== null) {
            socketRef.current.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate }),
            );
          }
        };

        
        connections[socketListId].ontrack = (event) => {
          const remoteStream = event.streams[0];
          setVideos((prevVideos) => {
            const alreadyExists = prevVideos.some(
              (video) => video.socketId === socketListId,
            );

            const updatedVideos = alreadyExists
              ? prevVideos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: remoteStream }
                    : video,
                )
              : [
                  ...prevVideos,
                  {
                    socketId: socketListId,
                    stream: remoteStream,
                    autoPlay: true,
                    playsinline: true,
                  },
                ];

            videoRef.current = updatedVideos;
            return updatedVideos;
          });
        };

        if (window.localStream !== undefined && window.localStream !== null) {
          attachLocalStreamToConnection(
            connections[socketListId],
            window.localStream,
          );
        } else {
         
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          attachLocalStreamToConnection(
            connections[socketListId],
            window.localStream,
          );
        }
      });

      if (id === socketIdRef.current) {
        

        for (let id2 in connections) {
          
          if (id2 === socketIdRef.current) continue;
          
          connections[id2].createOffer().then((description) => {
            connections[id2]
              .setLocalDescription(description)
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription }),
                );
              })
              .catch((e) => console.log(e));
          });
        }
      }
    });

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;

      if (hasConnectedOnceRef.current) {
       
        resetPeerConnections();
      }
      hasConnectedOnceRef.current = true;

      setConnectionStatus("connected");
      socketRef.current.emit("join-call", window.location.href, username);
    });

    socketRef.current.on("disconnect", () => {
      setConnectionStatus("reconnecting");
    });

    socketRef.current.on("reconnect_attempt", () => {
      setConnectionStatus("reconnecting");
    });

    socketRef.current.on("reconnect_failed", () => {
      setConnectionStatus("disconnected");
    });
  };

  useEffect(() => {
    
    if (accessState === "authorized") getpermission();
  }, [accessState]);

  useEffect(() => {
    if (localVideoRef.current && window.localStream) {
      localVideoRef.current.srcObject = window.localStream;
    }
  }, [askUsername]);

  let getUserMediaSuccess = (stream) => {
    //if a users turns off this video it is this functions responsibity to turn off video for everyone

    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      attachLocalStreamToConnection(connections[id], window.localStream);
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }
          //blacksilence

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            attachLocalStreamToConnection(connections[id], window.localStream);
          }
        }),
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 400 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  
  let stopScreenShare = () => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    if (window.localStream) {
      const cameraTrack = window.localStream.getVideoTracks()[0];
      for (let id in connections) {
        const sender = connections[id]
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender && cameraTrack) {
          sender.replaceTrack(cameraTrack).catch((e) => console.log(e));
        }
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = window.localStream;
      }
    }

    setScreen(false);
  };

  
  let startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = displayStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;

      for (let id in connections) {
        const sender = connections[id]
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack).catch((e) => console.log(e));
        }
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = displayStream;
      }

      screenTrack.onended = () => {
        stopScreenShare();
      };

      setScreen(true);
    } catch (e) {
      console.log(e);
    }
  };

  let toggleScreenShare = () => {
    if (screen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

 
  let cleanupCall = () => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    for (let id in connections) {
      try {
        connections[id].close();
      } catch (e) {
        console.log(e);
      }
    }
    connections = {};

    if (socketRef.current) {
     
      socketRef.current.io.opts.reconnection = false;
      socketRef.current.disconnect();
    }
  };

  let leaveCall = () => {
    cleanupCall();
    navigate("/");
  };

  useEffect(() => {
    
    return () => {
      cleanupCall();
    };
  }, []);

  let getUserMedia = () => {
    

    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  return (
    <div>
      {accessState === "checking" && (
        <div className="lobbyContainer">
          <h1>Checking your access...</h1>
        </div>
      )}

      {accessState === "unauthorized" && (
        <div className="lobbyContainer">
          <h1>Access denied</h1>
          <p className="permissionError">{accessError}</p>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      )}

      {accessState === "error" && (
        <div className="lobbyContainer">
          <h1>Something went wrong</h1>
          <p className="permissionError">{accessError}</p>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      )}

      {accessState === "authorized" && (askUsername === true ? (
        <div className="lobbyContainer">
          <h1>enter into the lobby</h1>

          {permissionError && (
            <p className="permissionError">{permissionError}</p>
          )}

          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />

          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer">
          {connectionStatus !== "connected" && (
            <div
              className={`connectionBanner ${
                connectionStatus === "disconnected" ? "connectionBannerError" : ""
              }`}
            >
              {connectionStatus === "reconnecting"
                ? "Connection lost - reconnecting..."
                : "Unable to reconnect. Check your network and rejoin."}
            </div>
          )}

          <div className="conferenceGrid">
            {videos.map((video) => (
              <div className="conferenceView" key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                ></video>
                <span className="participantLabel">
                  {remoteNames[video.socketId] || "Guest"}
                </span>
              </div>
            ))}
          </div>

          <video
            className="meetUserVideo"
            ref={localVideoRef}
            autoPlay
            muted
          ></video>

          <div className="buttonContainers">
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable && (
              <IconButton
                onClick={toggleScreenShare}
                style={{ color: "white" }}
              >
                {screen === true ? (
                  <StopScreenShareIcon />
                ) : (
                  <ScreenShareIcon />
                )}
              </IconButton>
            )}

            <IconButton
              onClick={leaveCall}
              style={{ color: "white", backgroundColor: "red" }}
            >
              <CallEndIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
