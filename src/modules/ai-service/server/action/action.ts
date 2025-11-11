import { PayloadConversation } from "@/modules/feature/types/ai-service/api-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getConversationById } from "../api";

function useSaveConversationAPI() {
  const mutate = useMutation({
    mutationFn: async (
        { payload }: { payload: PayloadConversation }
    ) => {
      const response = await fetch("/api/ai-service/create/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            generateId: payload.generateId,
            payload: payload.payload,
        }),
      });
      const result = await response.json();
      return result;
    },
  });
  return mutate;
}

function useGetConversationByIdAPI(id: Promise<string> | string) {
    const query = useQuery({
    queryKey: ["getConversationById", id],
    queryFn: async () => {
        const resolvedId = await id;
        const response = await getConversationById(resolvedId);
        return response;
    }
    })
    return query;
}

export const useConversationAPI = {
    useSaveConversationAPI,
    useGetConversationByIdAPI
};
