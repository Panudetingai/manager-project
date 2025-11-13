import { useMutation } from "@tanstack/react-query";
import { CallBackSignUpWithEmail } from "../server/callback/callback";

export const useUserVerify = () => {
    return useMutation({
        mutationFn: async (code: string) => {
            await CallBackSignUpWithEmail(code);
        }
    })
}