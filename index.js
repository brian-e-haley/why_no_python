addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function choose_variant(variants) {
  return variants[getRandomInt(variants.length)];
}

class ElementHandler {
  constructor({ content = null, url = null }) {
    this.content = content;
    this.url = url;
  }
  element(element) {
    // An incoming element, such as `div`
    if (this.content !== null) {
      element.setInnerContent(this.content);
    }
    if (this.url !== null) {
      element.setAttribute(
        "href",
        "https://github.com/brian-e-haley/why_no_python"
      );
    }
  }

  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
  }
}

const rewriter = new HTMLRewriter()
  .on("title", new ElementHandler({ content: "This is new!" }))
  .on("h1#title", new ElementHandler({ content: "This is also new!" }))
  .on(
    "p#description",
    new ElementHandler({ content: "This is a new description." })
  )
  .on(
    "a#url",
    new ElementHandler({
      content: "This is the GitHub",
      url: "https://github.com/brian-e-haley/why_no_python",
    })
  );

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

  const variant = choose_variant(variants);
  const variant_data = await fetch(variant);
  const variant_html = await variant_data.text();

  const original_response = new Response(variant_html, {
    headers: { "content-type": "text/html" },
  });

  const new_response = rewriter.transform(original_response);
  return new_response;
}
