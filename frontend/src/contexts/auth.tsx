import { useEffect, useState } from "react";
import auth from "./firebase/firebase"
const Authcontext = React.createContext();

export function AuthProvider({
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setuserLoggedIn] = useState(false);
    const [loading, setloading]=. useState(true);

    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(auth,initializeUser)

    }),[])

    async function initializeUser(user){
        if(user){
            
        }

    }







})