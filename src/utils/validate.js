export function validate(preset) {
  const errors = []

  if (!preset.name?.trim())
    errors.push({ field: 'name', msg: 'Name is required' })
  else if (!/^[A-Z]/.test(preset.name))
    errors.push({ field: 'name', msg: 'Name must be Title Case (start with uppercase)' })

  if (!preset.geometry?.length)
    errors.push({ field: 'geometry', msg: 'At least one geometry type required' })

  if (!Object.keys(preset.tags || {}).length)
    errors.push({ field: 'tags', msg: 'At least one tag (e.g. natural=arete) required' })

  const sorted = [...(preset.fields || [])].sort()
  if (JSON.stringify(preset.fields) !== JSON.stringify(sorted))
    errors.push({ field: 'fields', msg: `Fields must be A–Z sorted. Expected: ${sorted.join(', ')}` })

  const badTerms = (preset.terms || []).filter(t => /[A-Z]/.test(t))
  if (badTerms.length)
    errors.push({ field: 'terms', msg: `Terms must be lowercase: ${badTerms.join(', ')}` })

  return errors
}