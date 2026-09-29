// IO
// ==

// WebCrypto answers Fail by throwing, and a host without it throws a
// ReferenceError on the name, so the declared Result is what a program
// that handles Fail already expects here. The C lane gets the errno out
// of getrandom; WebCrypto carries no errno, so EIO stands in.
function io_random_u32() {
  try {
    return io_done(crypto.getRandomValues(new Uint32Array(1))[0]);
  } catch (e) {
    return io_fail(typeof e?.errno === "number" ? Math.abs(e.errno) : 5);
  }
}

io_eff(CID(IO.random_u32), io_random_u32);
