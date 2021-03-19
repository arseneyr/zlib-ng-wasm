
#include <emscripten.h>

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// ZStream

ZStream* EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_ZStream_0() {
  return new ZStream();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getPtr_0(ZStream* self) {
  return self->getPtr();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getNextOut_0(ZStream* self) {
  return self->getNextOut();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getNextIn_0(ZStream* self) {
  return self->getNextIn();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_setNextOut_1(ZStream* self, void* nextOut) {
  self->setNextOut(nextOut);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_setNextIn_1(ZStream* self, void* nextIn) {
  self->setNextIn(nextIn);
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getAvailIn_0(ZStream* self) {
  return self->getAvailIn();
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getAvailOut_0(ZStream* self) {
  return self->getAvailOut();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_setAvailIn_1(ZStream* self, unsigned int availIn) {
  self->setAvailIn(availIn);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_setAvailOut_1(ZStream* self, unsigned int availOut) {
  self->setAvailOut(availOut);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getDataType_0(ZStream* self) {
  return self->getDataType();
}

char* EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream_getErrMsg_0(ZStream* self) {
  return self->getErrMsg();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ZStream___destroy___0(ZStream* self) {
  delete self;
}

// z_stream

z_stream* EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_z_stream_0() {
  return new z_stream();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_next_in_0(z_stream* self) {
  return self->next_in;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_next_in_1(z_stream* self, void* arg0) {
  self->next_in = (unsigned char*)arg0;
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_next_out_0(z_stream* self) {
  return self->next_out;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_next_out_1(z_stream* self, void* arg0) {
  self->next_out = (unsigned char*)arg0;
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_avail_in_0(z_stream* self) {
  return self->avail_in;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_avail_in_1(z_stream* self, unsigned int arg0) {
  self->avail_in = arg0;
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_avail_out_0(z_stream* self) {
  return self->avail_out;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_avail_out_1(z_stream* self, unsigned int arg0) {
  self->avail_out = arg0;
}

char* EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_msg_0(z_stream* self) {
  return self->msg;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_msg_1(z_stream* self, char* arg0) {
  self->msg = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_get_data_type_0(z_stream* self) {
  return self->data_type;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream_set_data_type_1(z_stream* self, int arg0) {
  self->data_type = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_z_stream___destroy___0(z_stream* self) {
  delete self;
}

}

