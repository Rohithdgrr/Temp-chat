# Drizzle Migrations

Database migrations will be generated here when you run:

```bash
npm run db:generate
```

## Initial Migration

Run the following to create the database schema:

```bash
npm run db:push
```

Or to generate migration files:

```bash
npm run db:generate
npm run db:migrate
```

## Schema Tables

### rooms
- id: UUID (primary key)
- code: VARCHAR(6) unique
- status: waiting | active | ended
- maxUsers: INTEGER (default: 2)
- createdAt: TIMESTAMP
- expiresAt: TIMESTAMP

### users
- id: UUID (primary key)
- roomId: UUID (foreign key)
- nickname: VARCHAR(50)
- joinedAt: TIMESTAMP
- leftAt: TIMESTAMP (nullable)

### messages
- id: UUID (primary key)
- roomId: UUID (foreign key)
- userId: UUID (nullable, foreign key)
- senderName: VARCHAR(50)
- type: text | system | file
- content: TEXT
- metadata: JSONB (nullable)
- createdAt: TIMESTAMP
