import React from "react";
import Avatar from "react-avatar";
export default function Client(props) {
    return (
        <>
            <div className="client">
                <Avatar name={props.username} size={35} round="14px" />
                <span className="userName">{props.username}</span>
            </div>
        </>
    );
}
