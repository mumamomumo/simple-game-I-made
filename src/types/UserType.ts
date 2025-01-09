export type UserType =
  | {
      user_type: "host";
      host_id: string;
      game_id: string;
      started: boolean;
      game_data: {
        prompt?: string;
        duration?: number;
      };
      history?: { prompt?: string; words: string[] }[];
    }
  | {
      user_type: "player";
      game_id: string;
      username: string;
      entered_data: string[];
    }
  | {
      user_type: "guest";
    };
