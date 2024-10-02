import { cookies } from "next/headers";

export async function getUsers() {
    const res = await fetch("http://localhost:4000/clerk-auth", {
        headers: {
            cookie: cookies().toString()
        }
    });
    const data = await res.json();
    return data;
}
