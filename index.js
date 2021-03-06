const COOKIE_NAME = "variant";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function choose_variant(variants) {
  const number = getRandomInt(variants.length) + 1;
  return { html: variants[number - 1], number: number };
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

/**
 * Respond with hello worker text
 * @param {Request} request
 */

function getCookie(request, name) {
  let result = null;
  let cookieString = request.headers.get("Cookie");
  if (cookieString) {
    let cookies = cookieString.split(";");
    cookies.forEach((cookie) => {
      let cookieName = cookie.split("=")[0].trim();
      if (cookieName === name) {
        let cookieVal = cookie.split("=")[1];
        result = cookieVal;
      }
    });
  }
  return result;
}

async function handleRequest(request) {
  const response = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  );
  const data = await response.json();
  const variants = data.variants;

  const cookie = getCookie(request, COOKIE_NAME);
  const variant = cookie
    ? { html: variants[cookie - 1], number: cookie }
    : choose_variant(variants);

  const variant_data = await fetch(variant.html);
  const variant_html = await variant_data.text();

  const original_response = new Response(variant_html, {
    headers: { "content-type": "text/html" },
  });

  if (!cookie) {
    original_response.headers.append(
      `Set-Cookie`,
      `${COOKIE_NAME}=${variant.number}`
    );
  }

  const rewriter = new HTMLRewriter()
    .on("title", new ElementHandler({ content: "This is new!" }))
    .on("h1#title", new ElementHandler({ content: "This is also new!" }))
    .on(
      "p#description",
      new ElementHandler({ content: `This is variant ${variant.number}!` })
    )
    .on(
      "a#url",
      new ElementHandler({
        content: "Take me to the repo!",
        url: "https://github.com/brian-e-haley/why_no_python",
      })
    );

  const new_response = rewriter.transform(original_response);
  return new_response;
}
