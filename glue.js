
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// ZStream
/** @suppress {undefinedVars, duplicate} @this{Object} */function ZStream() {
  this.ptr = _emscripten_bind_ZStream_ZStream_0();
  getCache(ZStream)[this.ptr] = this;
};;
ZStream.prototype = Object.create(WrapperObject.prototype);
ZStream.prototype.constructor = ZStream;
ZStream.prototype.__class__ = ZStream;
ZStream.__cache__ = {};
Module['ZStream'] = ZStream;

ZStream.prototype['getPtr'] = ZStream.prototype.getPtr = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getPtr_0(self);
};;

ZStream.prototype['getNextOut'] = ZStream.prototype.getNextOut = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getNextOut_0(self);
};;

ZStream.prototype['getNextIn'] = ZStream.prototype.getNextIn = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getNextIn_0(self);
};;

ZStream.prototype['setNextOut'] = ZStream.prototype.setNextOut = /** @suppress {undefinedVars, duplicate} @this{Object} */function(nextOut) {
  var self = this.ptr;
  if (nextOut && typeof nextOut === 'object') nextOut = nextOut.ptr;
  _emscripten_bind_ZStream_setNextOut_1(self, nextOut);
};;

ZStream.prototype['setNextIn'] = ZStream.prototype.setNextIn = /** @suppress {undefinedVars, duplicate} @this{Object} */function(nextIn) {
  var self = this.ptr;
  if (nextIn && typeof nextIn === 'object') nextIn = nextIn.ptr;
  _emscripten_bind_ZStream_setNextIn_1(self, nextIn);
};;

ZStream.prototype['getAvailIn'] = ZStream.prototype.getAvailIn = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getAvailIn_0(self);
};;

ZStream.prototype['getAvailOut'] = ZStream.prototype.getAvailOut = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getAvailOut_0(self);
};;

ZStream.prototype['setAvailIn'] = ZStream.prototype.setAvailIn = /** @suppress {undefinedVars, duplicate} @this{Object} */function(availIn) {
  var self = this.ptr;
  if (availIn && typeof availIn === 'object') availIn = availIn.ptr;
  _emscripten_bind_ZStream_setAvailIn_1(self, availIn);
};;

ZStream.prototype['setAvailOut'] = ZStream.prototype.setAvailOut = /** @suppress {undefinedVars, duplicate} @this{Object} */function(availOut) {
  var self = this.ptr;
  if (availOut && typeof availOut === 'object') availOut = availOut.ptr;
  _emscripten_bind_ZStream_setAvailOut_1(self, availOut);
};;

ZStream.prototype['getDataType'] = ZStream.prototype.getDataType = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_ZStream_getDataType_0(self);
};;

ZStream.prototype['getErrMsg'] = ZStream.prototype.getErrMsg = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_ZStream_getErrMsg_0(self));
};;

  ZStream.prototype['__destroy__'] = ZStream.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_ZStream___destroy___0(self);
};
// z_stream
/** @suppress {undefinedVars, duplicate} @this{Object} */function z_stream() {
  this.ptr = _emscripten_bind_z_stream_z_stream_0();
  getCache(z_stream)[this.ptr] = this;
};;
z_stream.prototype = Object.create(WrapperObject.prototype);
z_stream.prototype.constructor = z_stream;
z_stream.prototype.__class__ = z_stream;
z_stream.__cache__ = {};
Module['z_stream'] = z_stream;

  z_stream.prototype['get_next_in'] = z_stream.prototype.get_next_in = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_z_stream_get_next_in_0(self);
};
    z_stream.prototype['set_next_in'] = z_stream.prototype.set_next_in = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_z_stream_set_next_in_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'next_in', { get: z_stream.prototype.get_next_in, set: z_stream.prototype.set_next_in });
  z_stream.prototype['get_next_out'] = z_stream.prototype.get_next_out = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_z_stream_get_next_out_0(self);
};
    z_stream.prototype['set_next_out'] = z_stream.prototype.set_next_out = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_z_stream_set_next_out_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'next_out', { get: z_stream.prototype.get_next_out, set: z_stream.prototype.set_next_out });
  z_stream.prototype['get_avail_in'] = z_stream.prototype.get_avail_in = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_z_stream_get_avail_in_0(self);
};
    z_stream.prototype['set_avail_in'] = z_stream.prototype.set_avail_in = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_z_stream_set_avail_in_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'avail_in', { get: z_stream.prototype.get_avail_in, set: z_stream.prototype.set_avail_in });
  z_stream.prototype['get_avail_out'] = z_stream.prototype.get_avail_out = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_z_stream_get_avail_out_0(self);
};
    z_stream.prototype['set_avail_out'] = z_stream.prototype.set_avail_out = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_z_stream_set_avail_out_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'avail_out', { get: z_stream.prototype.get_avail_out, set: z_stream.prototype.set_avail_out });
  z_stream.prototype['get_msg'] = z_stream.prototype.get_msg = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_z_stream_get_msg_0(self));
};
    z_stream.prototype['set_msg'] = z_stream.prototype.set_msg = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_z_stream_set_msg_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'msg', { get: z_stream.prototype.get_msg, set: z_stream.prototype.set_msg });
  z_stream.prototype['get_data_type'] = z_stream.prototype.get_data_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_z_stream_get_data_type_0(self);
};
    z_stream.prototype['set_data_type'] = z_stream.prototype.set_data_type = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_z_stream_set_data_type_1(self, arg0);
};
    Object.defineProperty(z_stream.prototype, 'data_type', { get: z_stream.prototype.get_data_type, set: z_stream.prototype.set_data_type });
  z_stream.prototype['__destroy__'] = z_stream.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_z_stream___destroy___0(self);
};