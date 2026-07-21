"use server"

import { c } from "radix-ui/checkbox-xTiVQnV-";

export const loginAction = async (formdata : FormData) => {
console.log("formdata", formdata);

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
}