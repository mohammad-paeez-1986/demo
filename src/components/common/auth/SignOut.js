import { useEffect } from "react";
import { useCookies } from "react-cookie";

const SignOut = () => {
    const [, , removeCookie] = useCookies(["token"]);

    useEffect(() => {
        removeCookie("token", { path: "/" });
    }, []);

    return <h1>signing out</h1>;
};


export default SignOut;
