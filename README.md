#  Wallet Service

A transactional ledger based wallet service built with Node.js, Express, TypeORM, and PostgreSQL.

---

## Prerequisites
NodeJS, psql, postgres server — **or** just use docker

## Quick start Docker

The easiest way to run the full stack (database + seed + app) in one command:

```bash
docker compose up --build
```

This will:
1. Start a Postgres container and wait until it's healthy
2. Run `seed.sql` automatically (creates tables + inserts seed data)
3. Build and start the app at `http://localhost:3000`

No `.env` needed, as the compose file sets `DATABASE_URL` internally.

---


## 1. Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://username:password@localhost:5432/testdb
PORT=3000
```

---

## 2. Spin Up the Database

### Option A — Local Postgres

```bash
psql -U postgres -c "CREATE DATABASE testdb;"
```

### Option B — Docker 

```bash
docker run -d \
  --name testdb-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  -p 5432:5432 \
  postgres:16
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Tables & Run the Seed Script

TypeORM's `synchronize: true` will auto-create tables on first boot, **or** you can use the standalone `seed.sql`.

**Option A — run the seed manually:**

```bash
psql $DATABASE_URL -f seed.sql
```

**Option B — use the setup script** (waits for Postgres, syncs schema, then seeds in one go):

```bash
chmod +x setup.sh
./setup.sh
```

`setup.sh` will:
1. Load `DATABASE_URL` from `.env`
2. Wait until Postgres is reachable
3. Start the app briefly so TypeORM creates the tables
4. Run `seed.sql` automatically

---

## 5. Start the Server

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

---

## API Overview

| Method | Path | Description | Request Body |
|--------|------|-------------|--------------|
| `POST` | `/user` | Create a user (optional referral BONUS) | `{ name: string, referralUserId?: string, referralWalletId?: string }` |
| `GET` | `/user` | List all users |  |
| `GET` | `/user/:userId` | Get user + their wallets |  |
| `GET` | `/user/:userId/wallet/:walletId/balance` | Get wallet balance |  |
| `POST` | `/user/:userId/wallet/:walletId/top-up` | Add funds (system -> user) | `{ amount: number, transactionId: string }` |
| `POST` | `/user/:userId/wallet/:walletId/purchase` | Spend funds (user -> system) | `{ amount: number }` |

There are 2 users created for testing purposes. 
IDs -  user_alice, user_bob 
AssetID - asset_coin
SystemUser - system
Wallet  - wallet_alice, wallet_bob, wallet_system


---

## Technology Choices

### Node.js + Express
Lightweight, faster to build, and my exprience in this technology.

### TypeScript
Much better than plain javascript, types help for large codebases.


### PostgreSQL
The right choice for a financial ledger because:
- **ACID transactions**: all-or-nothing writes
- **Row-level locking**: needed for the pessimistic lock 

---

## Concurrency Strategy

The wallet service handles concurrent requests safely through three layers:

### 1. Pessimistic Locking (deadlock-safe)

Before reading balances or writing ledger entries, the service locks both wallets involved in a transfer:

```ts
const lockWallets = async (manager: EntityManager, walletIds: string[]) => {
    const sortedIds = [...walletIds].sort(); // always lock in the same order
    await manager.find(Wallet, {
        where: { id: In(sortedIds) },
        lock: { mode: "pessimistic_write" }
    });
};
```

Wallets are **always locked in sorted ID order**. This prevents the classic deadlock scenario where request A locks wallet 1 then waits for wallet 2, while request B locks wallet 2 then waits for wallet 1.

### 2. Idempotency via Unique Insert

When using razorpay or other payment providers especially on client side mobile applications, they provide an "id" to the client itself, assuming that, I am taking transactionId from the client.

Every transfer requires a `transactionId`. The first thing the service does is attempt to insert that ID into `transaction_requests` (which has a unique primary key):

```ts
const isNewTransaction = async (manager: EntityManager, transactionId: string) => {
    try {
        await manager.insert(TransactionRequest, { id: transactionId, ... });
        return true;   // new — proceed
    } catch {
        return false;  // duplicate key → already processed
    }
};
```

If the same `transactionId` is sent twice (e.g. a client retry), the second request gets `{ duplicate: true }` instead of double-crediting the wallet.

### 3. Atomic Transactions (composable)

All DB writes happen inside a single `dbSource.transaction()`. If anything throws (insufficient funds, DB error, etc.), everything rolls back.

```

Together, these three layers cover the full concurrency surface:
- **Pessimistic locks** prevent two concurrent requests from reading a stale balance and both deciding they have enough funds.
- **Sorted lock ordering** ensures those locks are always acquired in the same sequence, eliminating deadlocks.
- **Unique `transactionId` insert** means a retried or duplicated request is detected at the DB level before any money moves — no application-level dedup logic needed.
- **Atomic transactions** guarantee that a failure at any step (balance check, ledger write, referral credit) leaves the database in exactly the state it was before the request arrived.
