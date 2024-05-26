import LogoutCard from "../plugins/login/LogoutCard.tsx"
import React from "react";

export default function UserPage({setLogined}: { setLogined: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <LogoutCard setLogined={setLogined}/>
    );
}