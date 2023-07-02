import { VulnerabilityInterface } from 'interfaces/vulnerability';
import { GetQueryInterface } from 'interfaces';

export interface BountyInterface {
  id?: string;
  amount: number;
  vulnerability_id?: string;
  created_at?: any;
  updated_at?: any;

  vulnerability?: VulnerabilityInterface;
  _count?: {};
}

export interface BountyGetQueryInterface extends GetQueryInterface {
  id?: string;
  vulnerability_id?: string;
}
