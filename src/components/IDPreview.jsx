export default function IDPreview({ preset, errors }) {
  const tagLine = Object.entries(preset.tags)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')

  return (
    <div style={{ borderRight: '1px solid #e0e3e8', background: '#f4f5f7', padding: 20, overflowY: 'auto' }}>
      <p style={sectionLabel}>iD Editor Preview</p>


      <div style={{ maxWidth: 300, margin: '0 auto', borderRadius: 10, overflow: 'hidden', border: '1px solid #ccc', boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}>

        {/* header */}
        <div style={{ background: '#2c3138', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {preset.icon
              ? <img
                  src={`https://cdn.jsdelivr.net/npm/@mapbox/maki/icons/${preset.icon}.svg`}
                  width={22} height={22} alt={preset.icon}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              : <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>?</span>
            }
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {preset.name || <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Unnamed Preset</span>}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tagLine || 'no tags yet'}
            </p>
          </div>
        </div>

        {/* Fields body */}
        <div style={{ background: '#fff', padding: '12px 14px' }}>
          {preset.fields.length === 0 && preset.moreFields.length === 0
            ? <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '24px 0' }}>Add fields to see preview</p>
            : <>
                {preset.fields.map(f => (
                  <div key={f} style={{ marginBottom: 10 }}>
                    <p style={{ margin: '0 0 3px', fontSize: 11, color: '#888', textTransform: 'capitalize' }}>
                      {f.replace(/_/g, ' ')}
                    </p>
                    <div style={{ height: 28, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fafafa' }} />
                  </div>
                ))}

                {preset.moreFields.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #e0e3e8' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#aaa' }}>
                      + {preset.moreFields.length} more field{preset.moreFields.length > 1 ? 's' : ''}
                    </p>
                    {preset.moreFields.map(f => (
                      <div key={f} style={{ marginBottom: 8, opacity: 0.5 }}>
                        <p style={{ margin: '0 0 3px', fontSize: 11, color: '#888', textTransform: 'capitalize' }}>
                          {f.replace(/_/g, ' ')}
                        </p>
                        <div style={{ height: 24, border: '1px dashed #d0d5dd', borderRadius: 5, background: '#fafafa' }} />
                      </div>
                    ))}
                  </div>
                )}
              </>
          }

          {/* Geometry badges */}
          {preset.geometry.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f1f5', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {preset.geometry.map(g => (
                <span key={g} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#e6f0fb', color: '#1a5fa5', border: '1px solid #b8d3f2', fontWeight: 600 }}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search terms */}
        {preset.terms.length > 0 && (
          <div style={{ background: '#f9f9f9', borderTop: '1px solid #e0e3e8', padding: '8px 14px' }}>
            <p style={{ fontSize: 10, color: '#aaa', margin: 0 }}>
              Also searchable as: {preset.terms.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Validation status card */}
      <ValidationCard errors={errors} />
    </div>
  )
}

function ValidationCard({ errors }) {
  const isValid = errors.length === 0

  return (
    <div style={{
      maxWidth: 300, margin: '16px auto 0',
      padding: '10px 14px', borderRadius: 8,
      background: isValid ? '#e8f4e5' : '#fff5f5',
      border: `1px solid ${isValid ? '#b8ddb0' : '#f5c0c0'}`
    }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: isValid ? '#2d6a22' : '#c0392b' }}>
        {isValid ? '✓ Validation passed — PR ready' : `✕ ${errors.length} issue${errors.length > 1 ? 's' : ''} found`}
      </p>
      {errors.map((e, i) => (
        <p key={i} style={{ margin: '4px 0 0', fontSize: 11, color: '#c0392b' }}>· {e.msg}</p>
      ))}
    </div>
  )
}

const sectionLabel = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#8c90a0', display: 'block', marginBottom: 12
}