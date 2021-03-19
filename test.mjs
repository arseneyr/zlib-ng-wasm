import Module from "./fast.js";
import { pipeline, Transform } from "stream";
import { createGzip } from "zlib";
import { createReadStream } from "fs";

const m = await Module();

const strm = new m.ZStream();
strm.setNextIn(m._malloc(100));

const p = strm.getNextIn();

// const inflater = new Transform({
//   construct() {},
//   transform(chunk, encoding, callback) {},
// });

class ZStream {
  constructor() {}
}

class Inflater extends Transform {
  strm = new m.z_stream();
  inBufSize = 32 * 1024;
  outBufSize = 32 * 1024;
  inBuf = m._malloc(this.inBufSize);
  outBuf = m._malloc(this.outBufSize);
  constructor(opts) {
    super(opts);
    this.strm.next_in = this.inBuf;
    const ret = m._inflateInit2(this.strm.ptr, 32);
  }
  destroy() {
    m._free(this.inBuf);
    m._free(this.outBuf);
  }
  _transform(chunk, encoding, cb) {
    let chunkBytesRemaining = chunk.byteLength;
    while (chunkBytesRemaining) {
      let nextIn;
      if (!this.strm.getAvailIn()) {
        this.strm.setNextIn(this.inBuf);
        nextIn = this.inBuf;
      } else {
        nextIn = this.strm.getNextIn();
      }
      const inBufRemaining = this.inBufSize - this.strm.getAvailIn();
      const outBefore = this.strm.getNextOut();
      const bytesWritten = Math.min(inBufRemaining, chunk.byteLength);
      m.HEAPU8.subarray(nextIn, nextIn + bytesWritten).set(chunk);
      this.strm.setAvailIn(bytesWritten);
      const ret = m._inflate(this.strm.getPtr(), 5);
      const outAfter = this.strm.getNextOut();
      const have = outAfter - outBefore;
      if (have) {
        this.push(m.HEAPU8.slice(outBefore, outBefore + have));
      }
      if (!this.strm.getAvailOut()) {
        this.strm.setNextOut(this.outBuf);
        this.strm.setAvailOut(this.outBufSize);
      }
    }
    debugger;
  }
}

pipeline(
  createReadStream("./testdata.xml"),
  createGzip(),
  new Inflater(),
  () => {}
);
