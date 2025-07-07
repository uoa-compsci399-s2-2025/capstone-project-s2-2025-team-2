import { User, Admin } from "data-layer/models/models";

// Mock user data
const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNumbers: ["123-456-7890", "987-654-3210"],
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phoneNumbers: ["123-456-7890", "987-654-3210"],
  },
  {
    id: 3,
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    phoneNumbers: ["123-456-7890", "987-654-3210"],
  },
];

let count = users.length;
// A post request should not contain an id.
export type UserCreationParams = Pick<
  User,
  "email" | "name" | "phoneNumbers"
> & {
  isAdmin?: boolean;
};

export class UserService {
  public get(id: number, name?: string): User {
    return {
      id,
      email: "jane@doe.com",
      name: name ?? "Jane Doe",
      phoneNumbers: [],
    };
  }

  public getAll(): User[] {
    return users;
  }

  public add(user: User): void {
    users.push(user);
  }

  public create(userCreationParams: UserCreationParams): User {
    count++;
    if (userCreationParams.isAdmin) {
      const admin: Admin = {
        id: count,
        ...userCreationParams,
        title: "Security Admin",
        admin_id: count * 1000,
        permissions: ["read", "write", "delete"],
      };
      users.push(admin);
      return admin;
    }
    const user = {
      id: count, // Random
      ...userCreationParams,
    };
    users.push(user);
    return user;
  }

  public async delete(id: number): Promise<void> {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    users.splice(index, 1);
  }
}
