"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_action/authAction";

const LoginForm = () => {
    return (
        <form action={loginAction} className="space-y-4">
            <Card className="p-4 space-y-4">
                <Input name="email" placeholder="Email" 
                type="email"
                required
                />
                <Input name="password" placeholder="Password"
                type="password"
                required
                />
                <Button type="submit">Login</Button>
            </Card>
        </form>
           
    );
};

export default LoginForm;