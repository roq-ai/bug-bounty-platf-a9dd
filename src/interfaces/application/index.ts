import { VulnerabilityInterface } from 'interfaces/vulnerability';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ApplicationInterface {
  id?: string;
  name: string;
  type: string;
  scope: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  vulnerability?: VulnerabilityInterface[];
  organization?: OrganizationInterface;
  _count?: {
    vulnerability?: number;
  };
}

export interface ApplicationGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  type?: string;
  scope?: string;
  organization_id?: string;
}
