import { headers } from "next/headers";
import { auth } from "../auth";

export async function getSessionInstance() {
    return auth.api.getSession({
        headers: await headers(),
    })
}