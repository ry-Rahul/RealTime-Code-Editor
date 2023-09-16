import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // Create New Room Function
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();

        setRoomId(id);
        toast.success("Created a new room");
    };

    // Join Room Function

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Room ID & Username is required");
            return;
        }

        // Redirect to Editor Page
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    // Handle Enter Key
    const handleInputEnter = (e) => {
        if (e.key === "Enter") {
            joinRoom();
        }

        // console.log('event ',e.code)
        // eg ... event  KeyV
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    src="code-sync.png"
                    className="homePageLogo"
                    alt="logo of code-sync app"
                />
                <h4 className="mainLabel">Paste invitation Room ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        placeholder="ROOM ID"
                        className="inputBox"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        placeholder="USERNAME"
                        className="inputBox"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="joinBtn btn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInput">
                        If you don't have an invite then create &nbsp;
                        <a
                            href=""
                            onClick={createNewRoom}
                            className="createNewRoom"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>

            <footer>
                <h4>
                    Built with ❤️ by{" "}
                    <a
                        href="https://github.com/ry-Rahul?tab=repositories"
                        target="_blank"
                    >
                        Rahul Yadav
                    </a>
                </h4>
            </footer>
        </div>
    );
}
