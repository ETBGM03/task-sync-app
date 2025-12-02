type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Carlos" },
  { id: 1, name: "Ana Duplicate" },
];

function uniqueUsers(list: User[]): User[] {
  const map = new Map<number, User>();

  list.forEach((user) => map.set(user.id, user));

  return Array.from(map.values());
}

console.log(uniqueUsers(users)); // [{ id: 1, name: "Ana" }, { id: 2, name: "Carlos" }]
