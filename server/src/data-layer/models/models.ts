export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumbers: string[];
}

export interface Admin extends User {
  title: string;
  admin_id: number;
  permissions?: string[];
}
