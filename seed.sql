
CREATE TABLE IF NOT EXISTS assets (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    "createTs"  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS system_users (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    "createTs"  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    "createTs"  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS wallets (
    id          VARCHAR PRIMARY KEY,
    "ownerId"   VARCHAR NOT NULL,
    "ownerType" VARCHAR NOT NULL,
    "assetId"   VARCHAR NOT NULL,
    "createTs"  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_requests (
    id              VARCHAR PRIMARY KEY,
    "transactionId" VARCHAR NOT NULL,
    "createTs"      TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ledger (
    id              VARCHAR PRIMARY KEY,
    "transactionId" VARCHAR NOT NULL,
    "walletId"      VARCHAR NOT NULL,
    amount          FLOAT NOT NULL,
    "createTs"      TIMESTAMP NOT NULL
);


-- asset table 

INSERT INTO assets (id, name, "createTs")
VALUES (
    'asset_coin',
    'Coin',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- system user 
INSERT INTO system_users (id, name, "createTs")
VALUES (
    'system',
    'SuperSystem',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- wallet system
INSERT INTO wallets (id, "ownerId", "ownerType", "assetId", "createTs")
VALUES (
    'wallet_system',
    'system',
    'system',
    'asset_coin',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- transactions table
INSERT INTO transaction_requests (id, "transactionId", "createTs")
VALUES (
    'txn_seed_system_opening',
    'txn_seed_system_opening',
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- ledger table (keeps hold for money exchange)
INSERT INTO ledger (id, "transactionId", "walletId", amount, "createTs")
VALUES (
    'ledger_seed_system_opening',
    'txn_seed_system_opening',
    'wallet_system',
    1000000,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- opening users
INSERT INTO users (id, name, "createTs")
VALUES
    ('user_alice', 'Alice',   NOW()),
    ('user_bob',   'Bob',     NOW())
ON CONFLICT (id) DO NOTHING;

-- opening wallets for users
INSERT INTO wallets (id, "ownerId", "ownerType", "assetId", "createTs")
VALUES
    ('wallet_alice', 'user_alice', 'user', 'asset_coin', NOW()),
    ('wallet_bob',   'user_bob',   'user', 'asset_coin', NOW())
ON CONFLICT (id) DO NOTHING;