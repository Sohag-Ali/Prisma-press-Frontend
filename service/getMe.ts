"use server"

import { cookies } from "next/headers";


export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if(!accessToken){
       return{
        success : false,
        message : "User not Looged in!"
       }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers: {
            // Authorization : accessToken as unknown as string
            
            // Authorization : `${accessToken}`,

            Cookie : `accessToken=${accessToken}`
        },
        cache : "force-cache",
        next : {
            revalidate : 60 * 60 * 24, // 1 day
            tags : ["My-Profile"]
        }
    })

    const result = res.json();
    // console.log(result);

    return result;

}