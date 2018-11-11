import json
import re
from json.decoder import WHITESPACE
import logging
logger = logging.getLogger(__name__)

def iterload(string_or_fp, cls=json.JSONDecoder, **kwargs):
    if  hasattr(string_or_fp, 'read'):
        string = string_or_fp.read()
    else:
        string = str(string_or_fp)

    decoder = cls(**kwargs)
    idx = WHITESPACE.match(string, 0).end()
    while idx < len(string):
        obj, end = decoder.raw_decode(string, idx)
        yield obj
        idx = WHITESPACE.match(string, end).end()
braces='{}[]'
whitespaceesc=' \t'
bracesesc='\\'+'\\'.join(braces)
balancemap=dict(zip(braces,[1,-1,1,-1]))
bracespat='['+bracesesc+']'
nobracespat='[^'+bracesesc+']*'
untilbracespat=nobracespat+bracespat
def streamingfinditer(pat,stream):
  for s in stream:
#    print "Read next line: " + s
    while 1:
      m = re.search(pat,s)
      if not m:
        yield (0,s)
        break
      yield (1,m.group())
      s = re.split(pat,s,1)[1]

def simpleorcompoundobjects(stream):
  obj = ""
  unbalanced = 0
  for (c,m) in streamingfinditer(re.compile(untilbracespat),stream):
    if (c == 0): # remainder of line returned, nothing interesting
      if (unbalanced == 0):
        yield (0,m)
      else:
        obj += m
    if (c == 1): # match returned
      if (unbalanced == 0):
        yield (0,m[:-1])
        obj += m[-1]
      else:
        obj += m
      unbalanced += balancemap[m[-1]]
      if (unbalanced == 0):
        yield (1,obj)
        obj="" 
def streamingiterload(stream):
  for c,o in simpleorcompoundobjects(stream):
    for x in iterload(o):
      yield x 


