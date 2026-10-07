export interface PanelContent {
  heading: string
  body: string
}

export interface PanelOptions {
  cols?: number
}

export function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > width) {
      if (line) lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export function renderPanel({ heading, body }: PanelContent, { cols = 80 }: PanelOptions = {}): string {
  const width = Math.max(Math.min(cols - 4, 72), 24)
  const contentLines = [heading, '', ...wrap(body, width)]
  const innerWidth = Math.max(...contentLines.map((l) => l.length), width)

  const top = `┌${'─'.repeat(innerWidth + 2)}┐`
  const bottom = `└${'─'.repeat(innerWidth + 2)}┘`
  const rows = contentLines.map((l) => `│ ${l.padEnd(innerWidth)} │`)

  return [top, ...rows, bottom].join('\n')
}
