import { useState } from 'react'

export default function JSONOutput({ json, errors }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isValid = errors.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20, background: '#1e2127', overflowY: 'auto' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={sectionLabel}>JSON Output</p>
        <button onClick={copy} style={{
          fontSize: 12, padding: '4px 14px', borderRadius: 5, cursor: 'pointer', fontWeight: 500,
          background: copied ? '#2d6a22' : '#3d4551',
          border: `1px solid ${copied ? '#5a9e4a' : '#555'}`,
          color: copied ? '#a8e89c' : '#ccc',
          transition: 'all 0.2s'
        }}>
          {copied ? '✓ Copied!' : 'Copy JSON'}
        </button>
      </div>

      <div style={{
        marginBottom: 12, padding: '8px 12px', borderRadius: 6,
        background: isValid ? '#1a3a1a' : '#3a1a1a',
        border: `1px solid ${isValid ? '#3a6b3a' : '#6b3a3a'}`
      }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: isValid ? '#7ebc6f' : '#e05252' }}>
          {isValid ? '✓ Valid — ready to paste into a PR' : `✕ ${errors.length} error${errors.length > 1 ? 's' : ''} — fix before submitting`}
        </p>
        {errors.map((e, i) => (
          <p key={i} style={{ margin: '4px 0 0', fontSize: 11, color: '#e08080' }}>· {e.msg}</p>
        ))}
      </div>

      {/* JSON code block */}
      <pre style={{
        flex: 1, margin: 0, padding: 16,
        background: '#12141a',
        border: '1px solid #2e3138',
        borderRadius: 8,
        fontSize: 12.5,
        fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
        color: '#abb2bf',
        lineHeight: 1.7,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        <SyntaxHighlight json={json} />
      </pre>

      {/* Footer note */}
      <p style={{ marginTop: 10, fontSize: 11, color: '#555', textAlign: 'center' }}>
        Arrays auto-sorted A–Z on export · Style-guide compliant
      </p>
    </div>
  )
}

// Simple syntax highlighter
function SyntaxHighlight({ json }) {
  const parts = []
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g

  let lastIndex = 0
  let match

  while ((match = regex.exec(json)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      parts.push(
        <span key={lastIndex} style={{ color: '#abb2bf' }}>
          {json.slice(lastIndex, match.index)}
        </span>
      )
    }

    const token = match[0]
    let color = '#e06c75' // string default

    if (/^"/.test(token)) {
      if (/:$/.test(token)) {
        color = '#61afef' // key
      } else {
        color = '#98c379' // string value
      }
    } else if (/true|false/.test(token)) {
      color = '#d19a66' // boolean
    } else if (/null/.test(token)) {
      color = '#c678dd' // null
    } else {
      color = '#d19a66' // number
    }

    parts.push(
      <span key={match.index} style={{ color }}>{token}</span>
    )

    lastIndex = match.index + token.length
  }

  // Remaining plain text
  if (lastIndex < json.length) {
    parts.push(
      <span key={lastIndex} style={{ color: '#abb2bf' }}>
        {json.slice(lastIndex)}
      </span>
    )
  }

  return <>{parts}</>
}

const sectionLabel = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#555', display: 'block'
}