export function generateJSON(preset) {
  const out = {}

  if (preset.name)                         out.name       = preset.name
  if (preset.geometry?.length)             out.geometry   = [...preset.geometry].sort()
  if (Object.keys(preset.tags||{}).length) out.tags       = preset.tags
  if (preset.icon)                         out.icon       = preset.icon
  if (preset.fields?.length)               out.fields     = [...preset.fields].sort()
  if (preset.moreFields?.length)           out.moreFields = [...preset.moreFields].sort()
  if (preset.terms?.length)                out.terms      = [...preset.terms].sort()

  return JSON.stringify(out, null, 2)
}