"use server"

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

const result = res.json();

console.log("result", result);  
return result;
}