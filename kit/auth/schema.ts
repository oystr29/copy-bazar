type Session = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    role: string;
    roles: {
      id: number;
      name: string;
      guard_name: string;
      created_at: string;
      updated_at: string;
    }[];
  };
};

export { Session };
