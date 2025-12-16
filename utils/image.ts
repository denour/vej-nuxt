export function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (!target) return
  // prevent infinite loop
  target.onerror = null
  target.src = '/images/placeholder.svg'
}
