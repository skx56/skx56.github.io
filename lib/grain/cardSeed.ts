import { dedent } from './format'

export const CARD_SCHEMA_SQL = dedent(`
  CREATE TABLE cardmembers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT NOT NULL,
    closed_on TEXT
  );

  CREATE TABLE cards (
    id INTEGER PRIMARY KEY,
    cardmember_id INTEGER NOT NULL,
    product TEXT NOT NULL,
    FOREIGN KEY (cardmember_id) REFERENCES cardmembers(id)
  );

  CREATE TABLE merchants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL
  );

  CREATE TABLE authorizations (
    id INTEGER PRIMARY KEY,
    card_id INTEGER NOT NULL,
    merchant_id INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    status TEXT NOT NULL,
    authorized_at TEXT NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id),
    FOREIGN KEY (merchant_id) REFERENCES merchants(id)
  );

  CREATE TABLE settlements (
    id INTEGER PRIMARY KEY,
    authorization_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    merchant_id INTEGER NOT NULL,
    settled_cents INTEGER NOT NULL,
    posted_on TEXT NOT NULL,
    FOREIGN KEY (authorization_id) REFERENCES authorizations(id),
    FOREIGN KEY (card_id) REFERENCES cards(id),
    FOREIGN KEY (merchant_id) REFERENCES merchants(id)
  );

  CREATE TABLE disputes (
    id INTEGER PRIMARY KEY,
    settlement_id INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    kind TEXT NOT NULL,
    opened_on TEXT NOT NULL,
    FOREIGN KEY (settlement_id) REFERENCES settlements(id)
  );

  CREATE TABLE reward_bonuses (
    settlement_id INTEGER NOT NULL,
    bonus_code TEXT NOT NULL,
    FOREIGN KEY (settlement_id) REFERENCES settlements(id)
  );
`)

export const CARD_SEED_SQL = dedent(`
  ${CARD_SCHEMA_SQL}

  INSERT INTO cardmembers (id, name, region, status, closed_on) VALUES
    (1, 'Priya Shah', 'West', 'open', NULL),
    (2, 'Evan Cole', 'Northeast', 'open', NULL),
    (3, 'Maya Chen', 'South', 'closed', '2026-09-28'),
    (4, 'Luis Ortega', 'South', 'open', NULL),
    (5, 'Helen Brooks', 'Northeast', 'open', NULL),
    (6, 'Noah Grant', 'West', 'open', NULL);

  INSERT INTO cards (id, cardmember_id, product) VALUES
    (11, 1, 'Platinum'),
    (12, 2, 'Gold'),
    (13, 3, 'Green'),
    (14, 4, 'Platinum'),
    (15, 5, 'Platinum'),
    (16, 6, 'Gold');

  INSERT INTO merchants (id, name, category) VALUES
    (1, 'Skyline Air', 'Travel'),
    (2, 'Harbor Grill', 'Dining'),
    (3, 'Northline Market', 'Retail'),
    (4, 'Atlas Hotels', 'Travel'),
    (5, 'Field Stationery', 'Retail');

  -- authorized_at is the swipe timestamp in UTC.
  -- posted_on is the issuer posting date, the date finance closes.
  -- 306 swipes 30 Jun 21:30 UTC and posts 1 Jul.
  -- 307 swipes 30 Sep 20:00 UTC and posts 1 Oct.
  INSERT INTO authorizations (id, card_id, merchant_id, amount_cents, status, authorized_at) VALUES
    (301, 11, 1, 420000, 'approved', '2026-07-15 14:10:00'),
    (302, 12, 2, 90000, 'approved', '2026-08-02 18:00:00'),
    (303, 13, 3, 150000, 'approved', '2026-08-20 16:40:00'),
    (304, 14, 1, 200000, 'declined', '2026-09-01 12:00:00'),
    (305, 15, 4, 310000, 'approved', '2026-09-18 19:20:00'),
    (306, 11, 5, 80000, 'approved', '2026-06-30 21:30:00'),
    (307, 14, 4, 120000, 'approved', '2026-09-30 20:00:00'),
    (308, 12, 2, 45000, 'approved', '2026-05-10 15:00:00'),
    (309, 15, 5, 80000, 'approved', '2026-10-02 13:15:00'),
    (310, 11, 2, 50000, 'approved', '2026-08-11 17:05:00');

  -- 304 declined and 310 is still pending: neither has a settlement.
  INSERT INTO settlements (id, authorization_id, card_id, merchant_id, settled_cents, posted_on) VALUES
    (201, 301, 11, 1, 420000, '2026-07-15'),
    (202, 302, 12, 2, 90000, '2026-08-02'),
    (203, 303, 13, 3, 150000, '2026-08-20'),
    (205, 305, 15, 4, 310000, '2026-09-18'),
    (206, 306, 11, 5, 80000, '2026-07-01'),
    (207, 307, 14, 4, 120000, '2026-10-01'),
    (208, 308, 12, 2, 45000, '2026-05-10'),
    (209, 309, 15, 5, 80000, '2026-10-02');

  INSERT INTO disputes (id, settlement_id, amount_cents, kind, opened_on) VALUES
    (1, 205, 45000, 'chargeback', '2026-09-25'),
    (2, 202, 32000, 'fraud_writeoff', '2026-09-12'),
    (3, 208, 10000, 'fraud_writeoff', '2026-05-20');

  -- Settlements 203 and 206 have no bonus row.
  -- Several bonuses on one settlement fan out a sum.
  INSERT INTO reward_bonuses (settlement_id, bonus_code) VALUES
    (201, '5x-air'),
    (201, 'platinum-boost'),
    (202, 'dining-4x'),
    (205, '5x-hotel'),
    (205, 'offer-q3'),
    (205, 'platinum-boost'),
    (207, '5x-hotel');
`)

export const CARD_TABLES: { name: string; note: string }[] = [
  { name: 'cardmembers', note: 'Maya Chen was closed on 28 Sep. Noah Grant has never spent.' },
  { name: 'cards', note: 'One cardmember can hold more than one product. This book has one card each.' },
  { name: 'merchants', note: 'Category lives on the merchant, the way an issuer network codes it.' },
  { name: 'authorizations', note: 'Swipe time in UTC. Declines and pending approvals are not spend.' },
  { name: 'settlements', note: 'Posted spend. posted_on is the date finance closes, not the swipe.' },
  { name: 'disputes', note: 'Chargebacks and fraud write-offs. Neither is spend.' },
  { name: 'reward_bonuses', note: 'Many bonuses per settlement. Joining this before a sum copies the money.' },
]

export const CARD_TRAPS: string[] = [
  'An authorization, a settlement, and a fraud write-off are three different amounts.',
  'Reward bonuses fan out. Join them before summing settled_cents and a hotel stay is counted once per bonus.',
  'Authorization 306 is 30 Jun 21:30 UTC and posts 1 Jul. Authorization 307 swipes 30 Sep and posts 1 Oct.',
  'Maya Chen is closed and still has an August settlement. Noah Grant is open and has never spent.',
  'A declined authorization and a still-pending approval have no settlement row.',
]
