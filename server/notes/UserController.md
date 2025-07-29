# User Controller

```Typescript
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;
```

Means `UserCreationParams` is a type, it takes out `email`, `name` and `phoneNumbers` from **User** as props and ignore `id` and `status`.

`Pick<T, K>` is a way to pick from type T to form a new type.

### User Service

`UserService` is a class exported to provide user-related actions.

#### Get Method

```Typescript
public get(id: number, name?: string): User {
return {
    id,
    email: "jane@doe.com",
    name: name ?? "Jane Doe",
    status: "Happy",
    phoneNumbers: [],
};
}
```

1. `get(id, name?)` is a way to mimic getting user from a database
2. takes in 2 parameters: `id: number` (must have), `name?: string` (optional)
3. if name is not provided, "Jane Doe" is used as default
4. the method returns a fixed **User** object which
   1. `email` is fixed
   2. `status` is "Happy"
   3. `phoneNumbers` is an empty array
