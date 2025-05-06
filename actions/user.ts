import { User } from "@/lib/generated/prisma";

export const getUserById = async (id: string) => {
    const res = await fetch(`/api/user/${id}`);
    return res.json();
};

export const updateUser = async (id: string, data: User) => {
    const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return res.json();
};