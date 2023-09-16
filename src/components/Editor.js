import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import ACTIONS from "../Actions";

export default function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);
    // console.log("ROOMID", roomId);
    // console.log("SOCKETREF", socketRef)

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: "javascript", json: true },
                    theme: "dracula",
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    autoCloseTags: true,
                    matchBrackets: true,
                }
            );

            // It will listen to the change event and will console the value of the editor
            editorRef.current.on("change", (instance, changes) => {
                const { origin } = changes;

                //get the value of the editor and store it in the code variable
                const code = instance.getValue();

                onCodeChange(code);

                if (origin !== "setValue") {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }

                // console.log("code", code);
            });
        }

        init();
    }, []);

    // wait for the code change event from the server and update the editor
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor" />;
}
