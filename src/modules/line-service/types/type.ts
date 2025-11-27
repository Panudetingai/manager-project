import { Database } from "../../../../utils/supabase/database.types";

export interface LINE_SERVICE_CONFIG_PAYLOAD {
  id: string;
  env: ENVDB_LINE_SERVICE["data"];
  category: Database["public"]["Enums"]["social"];
  workspaceId: string;
}
export interface ENVDB_LINE_SERVICE {
  data: {
    channelId: string;
    channelSecret: string;
  };
}

export interface LINE_SERVICE_GET_ENV_PAYLOAD {
  workspaceId: string;
  category: Database["public"]["Enums"]["social"];
}

export interface webhookEvent {
  destination: string;
  events: Event[];
}

export interface Event {
  type: string;
  message?: Message;
  timestamp: number;
  source: Source;
  replyToken?: string;
  mode: string;
  webhookEventId: string;
  deliveryContext: DeliveryContext;
}

export interface Message {
  type: string;
  id: string;
  text: string;
}

export interface Source {
  type: string;
  userId: string;
}

export interface DeliveryContext {
  isRedelivery: boolean;
}

export interface FollowEvent {
  type: string;
  follow: Follow;
  webhookEventId: string;
  deliveryContext: DeliveryContext;
  timestamp: number;
  source: Source;
  replyToken: string;
  mode: string;
}

export interface Follow {
  isUnblocked: boolean;
}

export interface DeliveryContext {
  isRedelivery: boolean;
}

export interface Source {
  type: string;
  userId: string;
}
