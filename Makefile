EMCC_FLAGS = \
	--no-entry \
	# -s EXPORTED_FUNCTIONS="['_inflateInit2', '_inflate', '_malloc', '_free']" \
	# -s MODULARIZE

all: zlib-ng.wasm zlib-ng-simd.wasm

bindings.cpp: glue.cpp

glue.cpp: bindings.idl
	python3 /emsdk/upstream/emscripten/tools/webidl_binder.py bindings.idl glue
	sed -i 's/next_\(in\|out\) = /&(unsigned char*)/g' glue.cpp

zlib-ng-simd.wasm: export CHOST = x86_64
zlib-ng-simd.wasm: export CFLAGS = -O2 -msimd128 -flto -DNDEBUG
zlib-ng-simd.wasm: zlib-ng/build-simd/lib/libz.a

zlib-ng.wasm: export CHOST = wasm32
zlib-ng.wasm: export CFLAGS = -O2 -flto -DNDEBUG
zlib-ng.wasm: zlib-ng/build/lib/libz.a

zlib-ng.wasm zlib-ng-simd.wasm: bindings.cpp
	emcc -O0 -g -o $@ $(EMCC_FLAGS) --post-js glue.js $^ -Izlib-ng/build/include


zlib-ng/%/lib/libz.a:
	cd zlib-ng && \
	emconfigure ./configure \
	--static \
	--zlib-compat \
	--prefix=./$* \
	--without-gzfileops \
	&& \
	emmake make -B -j8 install

clean:
	cd zlib-ng && git clean -fxd

.PHONY: all clean