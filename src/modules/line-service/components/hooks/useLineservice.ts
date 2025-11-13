import { useMutation, useQuery } from "@tanstack/react-query";
import { createLineServiceEnvDB, getLineServiceEnvDB } from "../../service/action/line";
import { LINE_SERVICE_CONFIG_PAYLOAD, LINE_SERVICE_GET_ENV_PAYLOAD } from "../../types/type";

export const useCreateLineServiceEnvDB = () => {
    return useMutation({
        mutationKey: ['create-line-service-envdb'],
        mutationFn: async (data: LINE_SERVICE_CONFIG_PAYLOAD) => {
            return await createLineServiceEnvDB(data);
        }
    });
}

export const useGetLineServiceEnvDB = (
    payload: LINE_SERVICE_GET_ENV_PAYLOAD
) => {
    return useQuery({
        queryKey: ['get-line-service-envdb', payload],
        queryFn: async () => {
            return await getLineServiceEnvDB(payload);
        }
    })
}