// A host whose WebCrypto answers every request by throwing, which is the
// shape the report gave: where crypto exists the method is replaced, and
// a host with no crypto at all gets one, so both the throw and the plain
// WebCrypto failure reach io_random_u32 the same way.
function crypto_broken_run() {
  const failing = () => {
    throw new Error("entropy source failed");
  };
  try {
    Object.defineProperty(globalThis.crypto, "getRandomValues",
      { value: failing, configurable: true, writable: true });
  } catch (_) {
    Object.defineProperty(globalThis, "crypto",
      { value: { getRandomValues: failing }, configurable: true, writable: true });
  }
  return { $: CID(Unit) };
}

io_eff(CID(crypto_broken), crypto_broken_run);
