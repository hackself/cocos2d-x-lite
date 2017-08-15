#ifndef _YVPACKET_OVER
#define _YVPACKET_OVER
#include "yvpacket_sdk.h"

static void parser_set_cstring(YV_PARSER parser, unsigned char cmdId, const char* value)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	parser_set_string(parser, cmdId, (char *)value);
#endif
}

static void parser_get_object(YV_PARSER parser, unsigned char cmdId, YV_PARSER object)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	parser_get_object(parser, cmdId, object, 0);
#endif
}
static unsigned char parser_get_uint8(YV_PARSER parser, unsigned char cmdId)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_get_uint8(parser, cmdId,  0);
#else
    return 0;
#endif
}
static unsigned int parser_get_uint32(YV_PARSER parser, unsigned char cmdId)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_get_uint32(parser, cmdId,  0);
#else
    return 0;
#endif
}
static int parser_get_integer(YV_PARSER parser, unsigned char cmdId)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_get_integer(parser, cmdId,  0);
#else
    return 0;
#endif
}
static const char* parser_get_string(YV_PARSER parser, unsigned char cmdId)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_get_string(parser, cmdId,  0);
#else
    return nullptr;
#endif
}
static char* parser_get_buffer(YV_PARSER parser, unsigned char cmdId, int& len)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_get_buffer(parser, cmdId, &len, 0);
#else
    return nullptr;
#endif
}
static bool parser_is_empty(YV_PARSER parser, unsigned char cmdId)
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC
	return parser_is_empty(parser, cmdId,  0);
#else
    return false;
#endif
}

#endif
