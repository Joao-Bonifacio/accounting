enum UserLevel {
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM
}

enum UserRole {
  USER,
  PRO,
  ADMIN,
}

export const mockUser = {
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com',
  nickname: 'john_doe',
  level: 'GOLD',
  role: 'USER',
}
