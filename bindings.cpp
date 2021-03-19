#include <zlib.h>
#include <stdlib.h>
#undef inflateInit
#undef inflateInit2

extern "C"
{
  int inflateInit(z_stream *strm)
  {
    return inflateInit_(strm, ZLIB_VERSION, (int)sizeof(z_stream));
  }
  int inflateInit2(z_stream *strm, int windowBits)
  {
    return inflateInit2_(strm, windowBits, ZLIB_VERSION, (int)sizeof(z_stream));
  }
}

class ZStream
{
private:
  z_stream _strm = {0};

public:
  // ZStream(unsigned int inLength, unsigned int outLength)
  // {
  //   _inBuf = (unsigned char *)malloc(inLength);
  //   _outBuf = (unsigned char *)malloc(outLength);
  //   _strm.next_in = _inBuf;
  //   _strm.next_out = _outBuf;
  // }
  // ~ZStream()
  // {
  //   free(_inBuf);
  //   free(_outBuf);
  // }

  void *getPtr()
  {
    return &_strm;
  }

  void *getNextOut()
  {
    return _strm.next_out;
  }
  void *getNextIn()
  {
    return _strm.next_in;
  }
  void setNextOut(void *nextOut)
  {
    _strm.next_out = (unsigned char *)nextOut;
  }
  void setNextIn(void *nextIn)
  {
    _strm.next_in = (unsigned char *)nextIn;
  }
  unsigned long getAvailIn()
  {
    return _strm.avail_in;
  }
  unsigned long getAvailOut()
  {
    return _strm.avail_out;
  }
  void setAvailIn(unsigned long availIn)
  {
    _strm.avail_in = availIn;
  }
  void setAvailOut(unsigned long availOut)
  {
    _strm.avail_out = availOut;
  }
  int getDataType()
  {
    return _strm.data_type;
  }
  char *getErrMsg()
  {
    return _strm.msg;
  }
};

#include "glue.cpp"