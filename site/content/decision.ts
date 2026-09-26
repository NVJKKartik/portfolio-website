/**
 * One decision on a record, drawn as a flow: what the call was, then the path it takes. `before` is the
 * path it replaced, when there was one. Drafted from each record's own text; Kartik checks them.
 */
export type Step = { label: string; note?: string; tone?: 'mine' | 'lost' };
export type Decision = { title: string; call: string; flow: Step[]; before?: Step[] };
