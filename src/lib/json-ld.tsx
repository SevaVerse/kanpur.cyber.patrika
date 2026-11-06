/**
 * Structured data rendering.
 *
 * JSON-LD is written into a raw <script> element, where React's escaping does
 * not apply. `JSON.stringify` leaves `<` untouched, so a string containing
 * `</script>` would close the element and whatever follows would execute.
 * Briefing headlines arrive from third-party news APIs and are published
 * without review, so that string is attacker-controllable.
 *
 * Escaping `<`, `>` and `&` as unicode sequences keeps the JSON identical to
 * a parser while making it impossible to break out of the script element.
 * U+2028/U+2029 are escaped too: they are legal in JSON but not in older JS.
 */
export function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ schemas }: { schemas: Record<string, unknown>[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
    </>
  );
}
