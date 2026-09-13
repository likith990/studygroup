
import {createAuthClient} from "better-auth/react";
import { API_BASE } from "./config";

export const authClient=createAuthClient({
    baseURL:API_BASE,
    fetchOptions: {
        credentials: "include",
    },
})