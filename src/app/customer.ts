export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string; // ISO
}

/** Fields the user edits; store owns id + createdAt. */
export type CustomerDraft = Omit<Customer, 'id' | 'createdAt'>;
