// File.size is the one effect whose success path does its work through a
// host call that needs no FFI (fs.fstatSync) and then asked io_sys() for a
// single number: the EOVERFLOW errno, 84 on mac and 75 elsewhere. io_sys()
// binds libc through bun:ffi, so where that module is missing the ask threw
// after the size had already been read, the catch turned it into io_fail(5),
// and since io_fail no longer crashes a perfectly good file answered
// Fail (5, "errno 5") with exit 0. Overwriting BEND_SYS with a table that
// throws on its next read is that host, reached from the lane the gate does
// run: the real one is missing only where the gate does not go. The throw
// restores the real table first and the read is gone after one hit, so the
// poison cannot outlive the call even if the program dies here, and the
// io_fail/io_strerror path behind it reads the real table as it should.
function ffi_absent_run() {
  const real = io_sys();
  globalThis.BEND_SYS = new Proxy(real, {
    get(target, prop) {
      globalThis.BEND_SYS = real;
      throw new Error("no ffi table on this host");
    },
  });
  return { $: CID(Unit) };
}

io_eff(CID(ffi_absent), ffi_absent_run);