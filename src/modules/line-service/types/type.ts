import { Database } from "../../../../utils/supabase/database.types";

export interface LINE_SERVICE_CONFIG_PAYLOAD {
    id: string;
    env: ENVDB_LINE_SERVICE['data'];
    category: Database['public']['Enums']['social']
    workspaceId: string;
}
export interface ENVDB_LINE_SERVICE {
    data: {
        channelId: string;
        channelSecret: string;
    }
}

export interface LINE_SERVICE_GET_ENV_PAYLOAD {
    workspaceId: string;
    category: Database['public']['Enums']['social'],
}