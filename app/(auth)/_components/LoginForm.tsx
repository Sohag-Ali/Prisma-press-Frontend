"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_action/authAction";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, false);

  useEffect(() => {
    if(!state) return;

    if(state.success) {
        toast.success(state.message, {
            description: state.statusCode === 200 ? "Login successful" : "Login failed",
        });
    }

    if(!state.success) {
        toast.error(state.message, {
            description: state.statusCode === 200 ? "Login successful" : "Login failed",
        });
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-4 space-y-4">
        <Input name="email" placeholder="Email" type="email" required />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Button type="submit">
            {
                pending ? "Logging in..." : "Login"
            }
            </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
