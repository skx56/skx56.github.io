import { CASES, routeQuestion, type Column, type GrainCase, type Row } from './cases'
import { CARD_CASES, routeCardQuestion } from './cardCases'

export type BookId = 'card' | 'harbor'

const BOOKS = {
  harbor: {
    cases: CASES,
    route: routeQuestion,
    refusal:
      'Grain will not invent a metric for that. Ask about last quarter’s revenue, active customers, the leading category, or cash collected.',
  },
  card: {
    cases: CARD_CASES,
    route: routeCardQuestion,
    refusal:
      'Grain will not invent a metric for that. Ask about last quarter’s posted spend, active cardmembers, the leading category, or fraud loss.',
  },
} as const
import { asNumber, formatByKind, formatDelta, type ValueKind } from './format'

export interface SqlExecResult {
  columns: string[]
  values: (string | number | null | Uint8Array)[][]
}

export interface Queryable {
  exec(sql: string): SqlExecResult[]
}

export interface RunResult {
  asked: string
  question: string
  tables: string[]
  valueKind: ValueKind
  assumption: GrainCase['assumption']
  joins: string[]
  filters: string[]
  grain: GrainCase['grain']
  critic: {
    rejectedSql: string
    rejectedLabel: string
    rejectedValue: number
    findings: { title: string; detail: string }[]
  }
  sql: string
  columns: Column[]
  rows: Row[]
  presentation: ReturnType<GrainCase['present']>
  shippedDisplay: string
  rejectedDisplay: string
  sensitivities: {
    label: string
    explanation: string
    display: string
    delta: string | null
  }[]
}

export type Outcome = { ok: true; result: RunResult } | { ok: false; message: string }

export function rowsOf(db: Queryable, sql: string): Row[] {
  const [result] = db.exec(sql)
  if (!result) return []
  return result.values.map((row) => {
    const record: Row = {}
    result.columns.forEach((column, index) => {
      const cell = row[index]
      record[column] = cell instanceof Uint8Array ? null : cell
    })
    return record
  })
}

function scalar(db: Queryable, sql: string): number {
  const rows = rowsOf(db, sql)
  return asNumber(rows[0]?.value)
}

function execute(db: Queryable, grainCase: GrainCase, asked: string): RunResult {
  const summary = rowsOf(db, grainCase.valueSql)
  const comparable = asNumber(summary[0]?.value)
  const rows = rowsOf(db, grainCase.detailSql)
  const presentation = grainCase.present(rows, comparable)
  const rejectedValue = scalar(db, grainCase.critic.rejectedSql)

  return {
    asked,
    question: grainCase.question,
    tables: grainCase.tables,
    valueKind: grainCase.valueKind,
    assumption: grainCase.assumption,
    joins: grainCase.joins,
    filters: grainCase.filters,
    grain: grainCase.grain,
    critic: {
      rejectedSql: grainCase.critic.rejectedSql,
      rejectedLabel: grainCase.critic.rejectedLabel,
      rejectedValue,
      findings: grainCase.critic.findings,
    },
    sql: grainCase.valueSql,
    columns: grainCase.columns,
    rows,
    presentation,
    shippedDisplay: formatByKind(grainCase.valueKind, presentation.comparable),
    rejectedDisplay: formatByKind(grainCase.valueKind, rejectedValue),
    sensitivities: grainCase.sensitivities.map((item) => {
      const value = scalar(db, item.sql)
      return {
        label: item.label,
        explanation: item.explanation,
        display: formatByKind(item.kind, value),
        delta: item.compare ? formatDelta(item.kind, presentation.comparable, value) : null,
      }
    }),
  }
}

export function answerQuestion(db: Queryable, asked: string, book: BookId = 'harbor', forcedId?: string): Outcome {
  const selected = BOOKS[book]
  const id = forcedId ?? selected.route(asked)
  if (!id || !(id in selected.cases)) {
    return { ok: false, message: selected.refusal }
  }

  try {
    return { ok: true, result: execute(db, selected.cases[id as keyof typeof selected.cases], asked.trim()) }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'The ledger rejected the query.'
    return { ok: false, message: detail }
  }
}
