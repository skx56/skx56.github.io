import { dedent, formatUsd } from './format'
import type { Column, GrainCase } from './cases'

export type CardCaseId = 'spend' | 'cardmembers' | 'category' | 'fraud'

const POSTED = "s.posted_on >= '2026-07-01' AND s.posted_on < '2026-10-01'"

function money(cents: number): string {
  return formatUsd(cents)
}

const spendColumns: Column[] = [
  { key: 'settlement_id', label: 'Settlement' },
  { key: 'cardmember', label: 'Cardmember' },
  { key: 'posted_on', label: 'Posted', kind: 'date' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'category', label: 'Category' },
  { key: 'settled_cents', label: 'Settled', kind: 'usd' },
]

export const CARD_CASES: Record<CardCaseId, GrainCase> = {
  spend: {
    id: 'spend',
    question: 'What was spend last quarter?',
    tables: ['settlements'],
    valueKind: 'usd',
    assumption: {
      chosen:
        'Posted spend: the sum of settlements.settled_cents whose issuer posting date falls in Q3 2026, 1 Jul through 30 Sep. Authorizations, declines, pending approvals, chargebacks, and fraud write-offs are other questions.',
      rejected: [
        {
          name: 'Approved authorizations',
          why: 'A swipe can be approved and never settle. Authorization 310 is still pending for $500.',
        },
        {
          name: 'Net of disputes',
          why: 'The Atlas Hotels chargeback is real. Posted spend is gross, so the dispute stays out of this total.',
        },
        {
          name: 'Swipe date',
          why: 'Finance closes on posted_on. The swipe timestamp moves two settlements across the quarter boundary.',
        },
      ],
    },
    joins: ['settlements only — authorizations are not on this path'],
    filters: ['posted_on in Q3 2026'],
    grain: {
      level: 'One row per settlement.',
      detail:
        'Reward bonuses sit beside that grain. Atlas Hotels has three bonus rows. Join them before the sum and the stay is counted three times.',
    },
    critic: {
      rejectedLabel: 'Settlements joined to reward bonuses, filtered on swipe time',
      rejectedSql: dedent(`
        SELECT COALESCE(SUM(s.settled_cents), 0) AS value
        FROM settlements s
        JOIN authorizations a ON a.id = s.authorization_id
        JOIN reward_bonuses b ON b.settlement_id = s.id
        WHERE date(a.authorized_at) >= '2026-07-01'
          AND date(a.authorized_at) < '2026-10-01'
      `),
      findings: [
        {
          title: 'The join copies the settlement',
          detail:
            'Atlas Hotels has three reward bonuses, so its $3,100 is counted three times. Skyline Air has two bonuses, so its $4,200 is counted twice.',
        },
        {
          title: 'The quarter follows the swipe, not the posting',
          detail:
            'Filtering authorized_at drops settlement 206, which swiped 30 Jun 21:30 UTC and posted 1 Jul, and pulls in settlement 207, which swiped 30 Sep and posted 1 Oct.',
        },
        {
          title: 'Settlements with no bonus disappear',
          detail:
            'The inner join to reward_bonuses drops Maya Chen’s $1,500 at Northline Market. That settlement has no bonus row, so the naive query pretends the spend did not post.',
        },
      ],
    },
    valueSql: dedent(`
      SELECT COALESCE(SUM(s.settled_cents), 0) AS value
      FROM settlements s
      WHERE ${POSTED}
    `),
    detailSql: dedent(`
      SELECT
        s.id AS settlement_id,
        c.name AS cardmember,
        s.posted_on AS posted_on,
        m.name AS merchant,
        m.category AS category,
        s.settled_cents AS settled_cents
      FROM settlements s
      JOIN cards k ON k.id = s.card_id
      JOIN cardmembers c ON c.id = k.cardmember_id
      JOIN merchants m ON m.id = s.merchant_id
      WHERE ${POSTED}
      ORDER BY s.posted_on, s.id
    `),
    columns: spendColumns,
    present: (_rows, comparable) => ({
      kicker: 'Q3 2026 posted spend',
      title: money(comparable),
      caption: 'Settled and posted · swipe time ignored · disputes excluded',
      comparable,
    }),
    sensitivities: [
      {
        label: 'Net the hotel chargeback',
        explanation: 'Subtract the 25 Sep chargeback on the Atlas Hotels settlement. Posted spend is gross. Net is this.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT (
            SELECT COALESCE(SUM(settled_cents), 0)
            FROM settlements s
            WHERE ${POSTED}
          ) - (
            SELECT COALESCE(SUM(d.amount_cents), 0)
            FROM disputes d
            JOIN settlements s ON s.id = d.settlement_id
            WHERE d.kind = 'chargeback'
              AND ${POSTED}
          ) AS value
        `),
      },
      {
        label: 'Use approved swipe amounts',
        explanation: 'Sum approved authorizations by swipe date. That pulls in the pending $500 and the 1 Oct posting, and drops the 1 Jul posting.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT COALESCE(SUM(amount_cents), 0) AS value
          FROM authorizations
          WHERE status = 'approved'
            AND date(authorized_at) >= '2026-07-01'
            AND date(authorized_at) < '2026-10-01'
        `),
      },
      {
        label: 'Keep the 1 Oct posting',
        explanation: 'Settlement 207 posted on 1 Oct. Leaving the quarter end open through that date adds the hotel stay to Q3.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT COALESCE(SUM(settled_cents), 0) AS value
          FROM settlements
          WHERE posted_on >= '2026-07-01'
            AND posted_on <= '2026-10-01'
        `),
      },
    ],
  },
  cardmembers: {
    id: 'cardmembers',
    question: 'How many active cardmembers?',
    tables: ['cardmembers', 'settlements', 'cards'],
    valueKind: 'count',
    assumption: {
      chosen:
        'Active means the cardmember is still open and has a settlement posted in the 90 days ending 4 Oct 2026. SQLite computes that window as 6 Jul through 4 Oct.',
      rejected: [
        {
          name: 'Every open account',
          why: 'Noah Grant is open and has never spent. A roster count includes him.',
        },
        {
          name: 'Anyone who ever settled',
          why: 'Maya Chen was closed on 28 Sep 2026. Her August settlement still exists.',
        },
      ],
    },
    joins: ['cardmembers.id = cards.cardmember_id', 'cards.id = settlements.card_id'],
    filters: ["status = 'open'", "posted_on inside date('2026-10-04', '-90 days')"],
    grain: {
      level: 'One row per cardmember, not per settlement.',
      detail: 'Priya Shah posted twice. She is one active cardmember. Counting settlements here would inflate the book.',
    },
    critic: {
      rejectedLabel: 'Distinct cardmembers with any settlement, ever',
      rejectedSql: dedent(`
        SELECT COUNT(DISTINCT k.cardmember_id) AS value
        FROM settlements s
        JOIN cards k ON k.id = s.card_id
      `),
      findings: [
        {
          title: 'A closed cardmember is still inside',
          detail:
            'Maya Chen is in this count. Her account was closed on 28 Sep 2026. The headline only moves by one, which is how a bad definition survives a glance.',
        },
        {
          title: 'The window bug is invisible in the total',
          detail:
            'This query ignores the 90-day window. On this book every open spender happens to have a posting inside it, so the missing filter does not change the number. The critic has to say that out loud.',
        },
      ],
    },
    valueSql: dedent(`
      SELECT COUNT(DISTINCT c.id) AS value
      FROM cardmembers c
      JOIN cards k ON k.cardmember_id = c.id
      JOIN settlements s ON s.card_id = k.id
      WHERE c.status = 'open'
        AND s.posted_on >= date('2026-10-04', '-90 days')
        AND s.posted_on <= '2026-10-04'
    `),
    detailSql: dedent(`
      SELECT
        c.name AS cardmember,
        c.region AS region,
        k.product AS product,
        MAX(s.posted_on) AS last_posting
      FROM cardmembers c
      JOIN cards k ON k.cardmember_id = c.id
      JOIN settlements s ON s.card_id = k.id
      WHERE c.status = 'open'
        AND s.posted_on >= date('2026-10-04', '-90 days')
        AND s.posted_on <= '2026-10-04'
      GROUP BY c.id
      ORDER BY last_posting, c.name
    `),
    columns: [
      { key: 'cardmember', label: 'Cardmember' },
      { key: 'region', label: 'Region' },
      { key: 'product', label: 'Product' },
      { key: 'last_posting', label: 'Latest posting', kind: 'date' },
    ],
    present: (_rows, comparable) => ({
      kicker: 'Active on 4 Oct 2026',
      title: String(comparable),
      caption: 'Open account · settlement posted in the trailing 90 days',
      comparable,
    }),
    sensitivities: [
      {
        label: 'Count every open account',
        explanation: 'Noah Grant is open and has never settled. A roster count includes him. The activity definition does not.',
        kind: 'count',
        compare: true,
        sql: dedent(`
          SELECT COUNT(*) AS value
          FROM cardmembers
          WHERE status = 'open'
        `),
      },
      {
        label: 'Keep closed cardmembers',
        explanation: 'Same 90-day window, but Maya Chen stays in because her August spend posted. The closed flag is the whole difference.',
        kind: 'count',
        compare: true,
        sql: dedent(`
          SELECT COUNT(DISTINCT c.id) AS value
          FROM cardmembers c
          JOIN cards k ON k.cardmember_id = c.id
          JOIN settlements s ON s.card_id = k.id
          WHERE s.posted_on >= date('2026-10-04', '-90 days')
            AND s.posted_on <= '2026-10-04'
        `),
      },
    ],
  },
  category: {
    id: 'category',
    question: 'Which category led last quarter?',
    tables: ['settlements', 'merchants'],
    valueKind: 'usd',
    assumption: {
      chosen:
        'Leader means the merchant category with the largest posted spend in Q3 2026. Same spend definition as the spend question, grouped by merchants.category.',
      rejected: [
        {
          name: 'Rank by swipe count',
          why: 'Dining can win a swipe count while travel wins the dollars. The question is about the book, so the rank is settled cents.',
        },
        {
          name: 'Rank authorizations',
          why: 'Declines and pending approvals are not spend, and they do not all share the posting date.',
        },
      ],
    },
    joins: ['settlements.merchant_id = merchants.id'],
    filters: ['posted_on in Q3 2026'],
    grain: {
      level: 'One row per settlement, summed by merchant category.',
      detail: 'Atlas Hotels must not be copied once per reward bonus before it lands in Travel.',
    },
    critic: {
      rejectedLabel: 'Category sums after joining bonuses, filtered on swipe time',
      rejectedSql: dedent(`
        SELECT m.category AS category, SUM(s.settled_cents) AS value
        FROM settlements s
        JOIN authorizations a ON a.id = s.authorization_id
        JOIN merchants m ON m.id = s.merchant_id
        JOIN reward_bonuses b ON b.settlement_id = s.id
        WHERE date(a.authorized_at) >= '2026-07-01'
          AND date(a.authorized_at) < '2026-10-01'
        GROUP BY m.category
        ORDER BY value DESC
      `),
      findings: [
        {
          title: 'The leaderboard can be right for the wrong reason',
          detail:
            'Travel still leads after the bad join. The amount does not. Atlas Hotels carries three bonuses, so that stay is counted three times.',
        },
        {
          title: 'Unbonused spend falls off the board',
          detail:
            'Northline Market is Retail and has no bonus row. Field Stationery posts on 1 Jul and also has no bonus. The inner join deletes Retail.',
        },
        {
          title: 'A hotel stay crosses the quarter',
          detail:
            'Settlement 207 is an Atlas Hotels stay posted 1 Oct. Its swipe is still 30 Sep, so the rejected query files it under Q3 Travel.',
        },
      ],
    },
    valueSql: dedent(`
      SELECT m.category AS category, SUM(s.settled_cents) AS value
      FROM settlements s
      JOIN merchants m ON m.id = s.merchant_id
      WHERE ${POSTED}
      GROUP BY m.category
      ORDER BY value DESC, m.category
    `),
    detailSql: dedent(`
      SELECT m.category AS category, SUM(s.settled_cents) AS value
      FROM settlements s
      JOIN merchants m ON m.id = s.merchant_id
      WHERE ${POSTED}
      GROUP BY m.category
      ORDER BY value DESC, m.category
    `),
    columns: [
      { key: 'category', label: 'Category' },
      { key: 'value', label: 'Posted spend', kind: 'usd' },
    ],
    present: (rows, comparable) => ({
      kicker: 'Q3 2026 leader',
      title: String(rows[0]?.category ?? 'No category'),
      caption: `${money(comparable)} posted spend`,
      comparable,
    }),
    sensitivities: [
      {
        label: 'Include the 1 Oct hotel',
        explanation: 'Settlement 207 posted on 1 Oct. Travel still leads, and the total moves by that stay.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT COALESCE(SUM(s.settled_cents), 0) AS value
          FROM settlements s
          JOIN merchants m ON m.id = s.merchant_id
          WHERE m.category = 'Travel'
            AND s.posted_on >= '2026-07-01'
            AND s.posted_on <= '2026-10-01'
        `),
      },
      {
        label: 'Net the hotel chargeback',
        explanation: 'Travel falls by the Atlas Hotels chargeback. Dining and Retail do not move, so the leader is unchanged.',
        kind: 'usd',
        compare: false,
        sql: dedent(`
          SELECT (
            SELECT COALESCE(SUM(s.settled_cents), 0)
            FROM settlements s
            JOIN merchants m ON m.id = s.merchant_id
            WHERE m.category = 'Travel'
              AND ${POSTED}
          ) - (
            SELECT COALESCE(SUM(d.amount_cents), 0)
            FROM disputes d
            JOIN settlements s ON s.id = d.settlement_id
            JOIN merchants m ON m.id = s.merchant_id
            WHERE d.kind = 'chargeback'
              AND m.category = 'Travel'
              AND ${POSTED}
          ) AS value
        `),
      },
    ],
  },
  fraud: {
    id: 'fraud',
    question: 'What was fraud loss last quarter?',
    tables: ['disputes'],
    valueKind: 'usd',
    assumption: {
      chosen:
        'Fraud loss is the sum of disputes.amount_cents where kind is fraud_writeoff and opened_on falls in Q3 2026. A chargeback is a customer dispute, not a confirmed fraud loss.',
      rejected: [
        {
          name: 'Every dispute',
          why: 'The Atlas Hotels chargeback is $450. Folding it into fraud loss mixes two teams’ numbers.',
        },
        {
          name: 'Spend net of fraud',
          why: 'Posted spend is a volume metric. Fraud loss is a loss metric. They do not share a grain.',
        },
      ],
    },
    joins: ['disputes only — settlements are not summed here'],
    filters: ["kind = 'fraud_writeoff'", 'opened_on in Q3 2026'],
    grain: {
      level: 'One row per fraud write-off.',
      detail: 'A write-off points at a settlement. Summing the settlement amount instead of the dispute amount would report the whole purchase as the loss.',
    },
    critic: {
      rejectedLabel: 'Every dispute opened in the quarter',
      rejectedSql: dedent(`
        SELECT COALESCE(SUM(amount_cents), 0) AS value
        FROM disputes
        WHERE opened_on >= '2026-07-01'
          AND opened_on < '2026-10-01'
      `),
      findings: [
        {
          title: 'A chargeback was booked as fraud',
          detail:
            'The Atlas Hotels dispute is a chargeback of $450 opened 25 Sep. Fraud loss on this book is the $320 write-off at Harbor Grill on 12 Sep.',
        },
        {
          title: 'The number is close enough to skip past',
          detail:
            'Adding the chargeback does not explode the total the way a fan-out join does. It still answers a different question than the one that was asked.',
        },
      ],
    },
    valueSql: dedent(`
      SELECT COALESCE(SUM(amount_cents), 0) AS value
      FROM disputes
      WHERE kind = 'fraud_writeoff'
        AND opened_on >= '2026-07-01'
        AND opened_on < '2026-10-01'
    `),
    detailSql: dedent(`
      SELECT
        d.id AS dispute_id,
        c.name AS cardmember,
        m.name AS merchant,
        d.opened_on AS opened_on,
        d.amount_cents AS amount_cents
      FROM disputes d
      JOIN settlements s ON s.id = d.settlement_id
      JOIN cards k ON k.id = s.card_id
      JOIN cardmembers c ON c.id = k.cardmember_id
      JOIN merchants m ON m.id = s.merchant_id
      WHERE d.kind = 'fraud_writeoff'
        AND d.opened_on >= '2026-07-01'
        AND d.opened_on < '2026-10-01'
      ORDER BY d.opened_on, d.id
    `),
    columns: [
      { key: 'dispute_id', label: 'Dispute' },
      { key: 'cardmember', label: 'Cardmember' },
      { key: 'merchant', label: 'Merchant' },
      { key: 'opened_on', label: 'Opened', kind: 'date' },
      { key: 'amount_cents', label: 'Write-off', kind: 'usd' },
    ],
    present: (_rows, comparable) => ({
      kicker: 'Q3 2026 fraud write-offs',
      title: money(comparable),
      caption: 'Confirmed fraud loss · chargebacks excluded · posting date ignored',
      comparable,
    }),
    sensitivities: [
      {
        label: 'Include chargebacks',
        explanation: 'Every dispute opened in Q3. The chargeback and the write-off are both real, and only one of them is fraud loss.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT COALESCE(SUM(amount_cents), 0) AS value
          FROM disputes
          WHERE opened_on >= '2026-07-01'
            AND opened_on < '2026-10-01'
        `),
      },
      {
        label: 'Use the whole purchase as the loss',
        explanation: 'The Harbor Grill write-off is $320 against a $900 settlement. Booking the settlement as the loss overstates the fraud.',
        kind: 'usd',
        compare: true,
        sql: dedent(`
          SELECT COALESCE(SUM(s.settled_cents), 0) AS value
          FROM disputes d
          JOIN settlements s ON s.id = d.settlement_id
          WHERE d.kind = 'fraud_writeoff'
            AND d.opened_on >= '2026-07-01'
            AND d.opened_on < '2026-10-01'
        `),
      },
    ],
  },
}

export const CARD_PROMPTS: { id: CardCaseId; label: string }[] = [
  { id: 'spend', label: CARD_CASES.spend.question },
  { id: 'cardmembers', label: CARD_CASES.cardmembers.question },
  { id: 'category', label: CARD_CASES.category.question },
  { id: 'fraud', label: CARD_CASES.fraud.question },
]

export function routeCardQuestion(raw: string): CardCaseId | null {
  const text = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return null

  const fraud = /\b(fraud|writeoff|write off|loss|losses|dispute|disputes|chargeback|chargebacks)\b/.test(text)
  const category = /\b(category|categories|merchant category|top|leader|leading)\b/.test(text)
  const cardmembers = /\b(active|cardmembers|cardmember|card members|card member|accounts|account)\b/.test(text)
  const spend = /\b(spend|spent|volume|settled|settlement|posted|posting|billed)\b/.test(text)

  if (fraud) return 'fraud'
  if (category) return 'category'
  if (cardmembers && !spend) return 'cardmembers'
  if (spend) return 'spend'
  return null
}
