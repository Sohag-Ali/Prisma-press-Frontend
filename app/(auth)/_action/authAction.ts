"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
type LoginState = {
    success: true;
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    }
 
}


export const loginAction = async (prevState: LoginState, formdata: FormData) => {
console.log("formdata", formdata);
console.log("prevState", prevState);

const email = formdata.get("email");
const password = formdata.get("password");

const payload = {
    email,
    password
}

const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
})

const result = await res.json();

if(result.success) {

    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
    });

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

    if(decodedToken.role === "USER") {
        redirect("/dashboard");
    }
    else if(decodedToken.role === "AUTHOR") {
        redirect("/author-dashboard");
    }
    else if(decodedToken.role === "ADMIN") {
        redirect("/admin-dashboard");
    }

    console.log("Decoded Token:", decodedToken);

    
    // redirect("/dashboard");
}



return result;
}