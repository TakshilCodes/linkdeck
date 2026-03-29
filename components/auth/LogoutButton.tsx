"use client"

import { signOut } from "next-auth/react";

export default function LogOutButton(){
    return(
        <button onClick={() => signOut()} className="bg-red-600 text-white py-2 px-2 rounded-xl">
            Logout
        </button>
    )
}