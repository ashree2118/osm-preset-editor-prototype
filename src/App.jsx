import { useState } from 'react'
import FormEditor from './components/FormEditor'
import { validate } from './utils/validate'
import { generateJSON } from './utils/generate'
import IDPreview from './components/IDPreview'

const EMPTY_PRESET = {
  name: '', geometry: [], tags: {}, icon: '',
  fields: [], moreFields: [], terms: []
}

export const EXAMPLES = {
  'natural=arete': {
    name: 'Mountain Arête', geometry: ['line'],
    tags: { natural: 'arete' }, icon: 'natural',
    fields: ['access', 'name'],
    moreFields: ['description', 'ele', 'source'],
    terms: ['arête', 'mountain ridge', 'ridge']
  },
  'amenity=shelter': {
    name: 'Shelter', geometry: ['point', 'area'],
    tags: { amenity: 'shelter' }, icon: 'shelter',
    fields: ['access', 'bench', 'capacity', 'name', 'opening_hours'],
    moreFields: ['description', 'fee', 'wheelchair'],
    terms: ['covered area', 'refuge']
  }
}

export default function App() {
  const [preset, setPreset] = useState(EMPTY_PRESET)

  const update  = (key, val) => setPreset(p => ({ ...p, [key]: val }))
  const errors  = validate(preset)
  const json    = generateJSON(preset)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#2c3138', color: '#fff', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#7ebc6f' }} />
        <strong style={{ fontSize: 15 }}>iD Preset Editor</strong>
        <span style={{ fontSize: 12, color: '#aaa' }}>GSoC 2026 Prototype · id-tagging-schema</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {Object.keys(EXAMPLES).map(k => (
            <button key={k} onClick={() => setPreset(EXAMPLES[k])}
              style={{ fontSize: 12, padding: '4px 12px', cursor: 'pointer', background: '#3d4551', border: '1px solid #555', color: '#ddd', borderRadius: 4 }}>
              Load: {k}
            </button>
          ))}
          <button onClick={() => setPreset(EMPTY_PRESET)}
            style={{ fontSize: 12, padding: '4px 12px', cursor: 'pointer', background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: 4 }}>
            Clear
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flex: 1, overflow: 'hidden' }}>
        <FormEditor preset={preset} update={update} errors={errors} />
        <IDPreview  preset={preset} />
        <JSONOutput json={json} errors={errors} />
      </div>
    </div>
  )
}