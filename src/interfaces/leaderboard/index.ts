import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LeaderboardInterface {
  id?: string;
  hacker_id?: string;
  points: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface LeaderboardGetQueryInterface extends GetQueryInterface {
  id?: string;
  hacker_id?: string;
}
