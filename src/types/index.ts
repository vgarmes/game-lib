import { GAME_STATUSES } from "@/constants";

export type Signature = {
  hash: string;
  timestamp: number;
  expires: number;
};

export type Status = (typeof GAME_STATUSES)[number];
