// DEFINE GLOBAL TYPESCRIPT TYPES HERE

// Define a custom type for the decoded token
export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  image: string | null;
  userIsApproved: boolean;
   // Add other properties if needed
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  accounts?: Account[];
  createdAt: Date;
  updatedAt?: Date | null;
  verified?: boolean | null;
  password: string;
  // role?: RoleEnumType | null ;
}

export interface Account {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
