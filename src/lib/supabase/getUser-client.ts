'use client'
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../utils/supabase/client";

export async function getUserClient() {
    const supabase = createClient();
    const {data, error} = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
}

export function useUserClient() {
    const supabase = createClient();

    const mutate = useQuery({
        queryKey: ["getUser"],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                throw new Error(error.message);
            }
            return data.user;
        },
        staleTime: Infinity,
    })

    return mutate;
}