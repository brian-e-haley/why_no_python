addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
  const data = await response.json()
  const variants = data.variants
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}
