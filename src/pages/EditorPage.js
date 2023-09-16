import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from "react-router-dom";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";



export default function EditorPage() {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    // console.log("roomId", roomId)
    // console.log("socketRef", socketRef)
    const reactNavigator = useNavigate();

    // console.log("roomId", roomId);

    // _________________ States _________________________
    const [clients, setClients] = useState([]);

    // _________________ useEffect _________________________
    // useEffect(() => {
    //     const init = async () => {
    //         socketRef.current = await initSocket();
    //         socketRef.current.on("connect_error", (err) => handleErrors(err));
    //         socketRef.current.on("connect_failed", (err) => handleErrors(err));

    //         function handleErrors(err) {
    //             console.log("socket error", err);
    //             toast.error("socket connection failed ,try again later");
    //             reactNavigator("/");
    //         }
    //         socketRef.current.emit(ACTIONS.JOIN, {
    //             roomId,
    //             username: location.state?.userName,
    //         });

    //         //Listen for joined event________________________________________
    //         socketRef.current.on(
    //             ACTIONS.JOINED,
    //             ({ clients, username, socketId }) => {
    //                 if (username !== location.state?.userName) {
    //                     toast.success(`${username} joined the room`);
    //                     console.log(`${username} joined the room`);
    //                 }

    //                 setClients(clients);
    //                 socketRef.current.emit(ACTIONS.SYNC_CODE, {
    //                     code: codeRef.current,
    //                     socketId,
    //                 });
    //             }
    //         );

    //         //Listen for disconnected event____________________________________
    //         // On is used to listen to the event
    //         socketRef.current.on(
    //             ACTIONS.DISCONNECTED,
    //             ({ socketId, username }) => {
    //                 toast.success(`${username} left the room`);
    //                 console.log(`${username} left the room`);
    //                 setClients((prevClients) => {
    //                     return prevClients.filter(
    //                         (client) => client.socketId !== socketId
    //                     );
    //                 });
    //             }
    //         );
    //     };

    //     // _________________ Clean Up Function _________________________
    //     init();

    //     //don't forget to return a clean up function in useEffect( listner ko clear krna hai)
    //     return () => {
    //         socketRef.current.disconnect();
    //         socketRef.current.off(ACTIONS.JOINED);
    //         socketRef.current.off(ACTIONS.DISCONNECTED);
    //     };
    // }, []);
    // //if we don't use [] array then it will run infinite times


    // // _________________ Functions _________________________
    // const  copyRoomId = async () => {
    //     try {
    //         await navigator.clipboard.writeText(roomId);
    //         toast.success("Room ID copied");
    //     }catch(err){
    //         toast.error("Failed to copy");
    //         console.log(err);
    //     }
    // };

    // const leaveRoom = () => {
    //     socketRef.current.disconnect();
    //     reactNavigator("/");
    // }

    // // _________________ JSX _________________________
    // if (!location.state) {
    //     return <Navigate to="/" />;
    // }


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            {/* Aside _________________________ */}
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImg"
                            src="/code-sync.png"
                            alt="Image logo"
                        />
                    </div>
                    <h3>Connected</h3>

                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <button className="btn copyBtn" onClick={copyRoomId}>Copy Room ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
            </div>

            {/* Editor _________________________ */}
            <div className="editorWrap">
                <Editor socketRef={socketRef} roomId={roomId}
                    onCodeChange={(code) => { codeRef.current = code; }} />
            </div>
        </div>
    );
}
