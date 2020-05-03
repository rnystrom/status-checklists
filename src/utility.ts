export interface ChecklistResult {
  open: number,
  closed: number
}

export function findChecklists(body: string): ChecklistResult {
  const regex = /^( +)?- \[( |x)\]/gm

  var sumOpen = 0
  var sumClosed = 0

  var match: RegExpExecArray | null = null
  while (match = regex.exec(body)) {
    if (match.length != 3)  {
      continue
    }
    const isOpen = match[2] == ' '
    sumOpen += isOpen ? 1 : 0
    sumClosed += isOpen ? 0 : 1
  }

  return {open: sumOpen, closed: sumClosed}
}
