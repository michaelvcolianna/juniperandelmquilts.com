export const metaUrl = () => {
  let { fullPath } = useRoute()
  let baseUrl = process.client ? window.location.origin : ''

  return `${baseUrl}${fullPath}`.replace(/\/+$/, '')
}
