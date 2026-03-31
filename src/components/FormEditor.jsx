import { useState } from 'react'
import { MAKI_ICONS } from '../data/icons'
import { COMMON_FIELDS } from '../data/fields'

const GEOMETRY_TYPES = ['point', 'line', 'area', 'relation', 'vertex']

export default function FormEditor({ preset, update, errors, onFirstChange }) {
  const [tagKey, setTagKey]       = useState('')
  const [tagVal, setTagVal]       = useState('')
  const [fieldInput, setFieldInput] = useState('')
  const [mfInput, setMfInput]     = useState('')
  const [termInput, setTermInput] = useState('')
  const [iconSearch, setIconSearch] = useState('')
  const [showIcons, setShowIcons] = useState(false)
  const [showFieldSuggest, setShowFieldSuggest] = useState(false)
  const [showMfSuggest, setShowMfSuggest]       = useState(false)

  const err = (field) => errors.find(e => e.field === field)

  // Tags
  const addTag = () => {
    onFirstChange()
    if (!tagKey.trim()) return
    update('tags', { ...preset.tags, [tagKey.trim()]: tagVal.trim() })
    setTagKey(''); setTagVal('')
  }
  const removeTag = (k) => {
    const t = { ...preset.tags }
    delete t[k]
    update('tags', t)
  }

  // Fields / moreFields
  const addToList = (key, val, setVal) => {
    onFirstChange()
    const v = val.trim()
    if (!v || preset[key].includes(v)) return
    update(key, [...preset[key], v])
    setVal('')
  }
  const toggleGeom = (g) => {
    onFirstChange()
    const next = preset.geometry.includes(g)
      ? preset.geometry.filter(x => x !== g)
      : [...preset.geometry, g]
    update('geometry', next)
  }
  const removeFromList = (key, item) => update(key, preset[key].filter(x => x !== item))

  // Terms
  const addTerm = () => {
    const v = termInput.trim().toLowerCase()
    if (!v || preset.terms.includes(v)) return
    update('terms', [...preset.terms, v])
    setTermInput('')
  }

  // Auto-sort all arrays
  const autoSort = () => {
    update('fields',     [...preset.fields].sort())
    update('moreFields', [...preset.moreFields].sort())
    update('terms',      [...preset.terms].sort())
    update('geometry',   [...preset.geometry].sort())
  }

  const fieldSuggestions = COMMON_FIELDS
    .filter(f => f.includes(fieldInput.toLowerCase()) && !preset.fields.includes(f))
    .slice(0, 6)

  const mfSuggestions = COMMON_FIELDS
    .filter(f => f.includes(mfInput.toLowerCase()) && !preset.moreFields.includes(f))
    .slice(0, 6)

  const filteredIcons = MAKI_ICONS.filter(i => i.includes(iconSearch.toLowerCase()))

  return (
    <div style={{ borderRight: '1px solid #e0e3e8', overflowY: 'auto', padding: 20, background: '#fff', height: '100%' }}>
      <p style={sectionLabel}>Form Editor</p>

      {/* name */}
      <Field label="Name *" error={err('name')}>
        <input
          type="text"
          value={preset.name}
          onChange={e => { onFirstChange(); update('name', e.target.value) }}
          placeholder="e.g. Mountain Arête"
          style={{ ...inputStyle, borderColor: err('name') ? '#e05252' : '#d0d5dd' }}
        />
      </Field>

      {/* geometry */}
      <Field label="Geometry *" error={err('geometry')}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {GEOMETRY_TYPES.map(g => (
            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={preset.geometry.includes(g)}
                onChange={() => toggleGeom(g)}
              />
              {g}
            </label>
          ))}
        </div>
      </Field>

      {/* icon */}
      <Field label="Icon">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, border: '1px solid #d0d5dd', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', flexShrink: 0 }}>
            {preset.icon
              ? <img src={`https://cdn.jsdelivr.net/npm/@mapbox/maki/icons/${preset.icon}.svg`} width={20} height={20} alt={preset.icon} />
              : <span style={{ fontSize: 10, color: '#aaa' }}>none</span>}
          </div>
          <button onClick={() => setShowIcons(v => !v)} style={{ ...btnStyle, flex: 1, textAlign: 'left', color: preset.icon ? '#1a1c23' : '#aaa' }}>
            {preset.icon || 'Pick an icon...'}
          </button>
          {preset.icon && (
            <button onClick={() => update('icon', '')} style={{ ...btnStyle, color: '#e05252', padding: '6px 10px' }}>✕</button>
          )}
        </div>

        {/* Inline icon picker */}
        {showIcons && (
          <div style={{ marginTop: 8, border: '1px solid #e0e3e8', borderRadius: 8, padding: 10, background: '#fafbfc' }}>
            <input
              type="search"
              value={iconSearch}
              onChange={e => setIconSearch(e.target.value)}
              placeholder="Search maki icons..."
              style={{ ...inputStyle, marginBottom: 10 }}
              autoFocus
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: 5, maxHeight: 220, overflowY: 'auto' }}>
              {filteredIcons.map(icon => (
                <button key={icon}
                  onClick={() => { update('icon', icon); setShowIcons(false) }}
                  title={icon}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '7px 4px', borderRadius: 6, cursor: 'pointer', fontSize: 10, color: '#555',
                    border: preset.icon === icon ? '2px solid #7ebc6f' : '1px solid #e0e3e8',
                    background: preset.icon === icon ? '#e8f4e5' : '#fff',
                    wordBreak: 'break-all', textAlign: 'center'
                  }}>
                  <img src={`https://cdn.jsdelivr.net/npm/@mapbox/maki/icons/${icon}.svg`} width={18} height={18} alt={icon} />
                  {icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </Field>

      {/* tags */}
      <Field label="Tags *" error={err('tags')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {Object.entries(preset.tags).map(([k, v]) => (
            <span key={k} style={tagChip}>
              {k}={v}
              <button onClick={() => removeTag(k)} style={chipBtn}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" value={tagKey} onChange={e => setTagKey(e.target.value)}
            placeholder="key" style={{ ...inputStyle, flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && addTag()} />
          <span style={{ alignSelf: 'center', color: '#aaa', fontSize: 14 }}>=</span>
          <input type="text" value={tagVal} onChange={e => setTagVal(e.target.value)}
            placeholder="value" style={{ ...inputStyle, flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && addTag()} />
          <button onClick={addTag} style={{ ...btnStyle, background: '#7ebc6f', color: '#fff', border: '1px solid #5a9e4a', padding: '6px 14px' }}>+</button>
        </div>
      </Field>

      {/* fields */}
      <Field label="Fields" error={err('fields')} warn>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {preset.fields.map(f => (
            <span key={f} style={fieldChip}>
              {f} <button onClick={() => removeFromList('fields', f)} style={chipBtn}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <input type="text" value={fieldInput}
            onChange={e => { setFieldInput(e.target.value); setShowFieldSuggest(true) }}
            onFocus={() => setShowFieldSuggest(true)}
            onBlur={() => setTimeout(() => setShowFieldSuggest(false), 150)}
            onKeyDown={e => e.key === 'Enter' && addToList('fields', fieldInput, setFieldInput)}
            placeholder="Type to search fields..."
            style={inputStyle} />
          {showFieldSuggest && fieldSuggestions.length > 0 && (
            <div style={suggestBox}>
              {fieldSuggestions.map(s => (
                <div key={s} style={suggestItem}
                  onMouseDown={() => { addToList('fields', s, setFieldInput); setShowFieldSuggest(false) }}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      {/* more fileds */}
      <Field label="More Fields">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {preset.moreFields.map(f => (
            <span key={f} style={{ ...fieldChip, opacity: 0.7 }}>
              {f} <button onClick={() => removeFromList('moreFields', f)} style={chipBtn}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <input type="text" value={mfInput}
            onChange={e => { setMfInput(e.target.value); setShowMfSuggest(true) }}
            onFocus={() => setShowMfSuggest(true)}
            onBlur={() => setTimeout(() => setShowMfSuggest(false), 150)}
            onKeyDown={e => e.key === 'Enter' && addToList('moreFields', mfInput, setMfInput)}
            placeholder="Additional fields (hidden by default)..."
            style={inputStyle} />
          {showMfSuggest && mfSuggestions.length > 0 && (
            <div style={suggestBox}>
              {mfSuggestions.map(s => (
                <div key={s} style={suggestItem}
                  onMouseDown={() => { addToList('moreFields', s, setMfInput); setShowMfSuggest(false) }}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      {/* terms */}
      <Field label="Search Terms" error={err('terms')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {preset.terms.map(t => (
            <span key={t} style={{ ...fieldChip, background: '#f0f4ff', borderColor: '#c5d0ee', color: '#4a5fa5' }}>
              {t} <button onClick={() => removeFromList('terms', t)} style={chipBtn}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" value={termInput} onChange={e => setTermInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTerm()}
            placeholder="lowercase only (e.g. mountain ridge)"
            style={inputStyle} />
          <button onClick={addTerm} style={{ ...btnStyle, padding: '6px 14px' }}>+</button>
        </div>
      </Field>

      {/* auto sort */}
      <button onClick={autoSort}
        style={{ ...btnStyle, width: '100%', marginTop: 8, background: '#e8f4e5', color: '#2d6a22', borderColor: '#b8ddb0', fontWeight: 500 }}>
        Auto-sort all arrays (A–Z)
      </button>
    </div>
  )
}

// Sub-component for consistent field layout
function Field({ label, children, error, warn }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <span style={sectionLabel}>{label}</span>
      {children}
      {error && <p style={{ fontSize: 11, color: warn ? '#c97a00' : '#e05252', marginTop: 4 }}>{error.msg}</p>}
    </div>
  )
}

// Styles
const sectionLabel = { fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8c90a0', display: 'block', marginBottom: 6 }
const inputStyle   = { width: '100%', padding: '7px 10px', border: '1px solid #d0d5dd', borderRadius: 6, fontSize: 13, outline: 'none', fontFamily: 'inherit' }
const btnStyle     = { padding: '6px 12px', border: '1px solid #d0d5dd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
const tagChip      = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'monospace', background: '#e8f4e5', color: '#2d6a22', border: '1px solid #b8ddb0' }
const fieldChip    = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 12, background: '#f0f1f5', color: '#555', border: '1px solid #dde0e8' }
const chipBtn      = { border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: '#999', padding: 0, lineHeight: 1 }
const suggestBox   = { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #d0d5dd', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }
const suggestItem  = { padding: '7px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace' }