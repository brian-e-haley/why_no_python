addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const response = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  );
  const data = await response.json();
  const variants = data.variants;
  const variant_1 = await fetch(variants[0]);
  const response_1 = await variant_1.text();
  console.log(response_1);
  return new Response(response_1, {
    headers: { "content-type": "text/html" },
  });
}
