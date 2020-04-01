from pygdbmi.gdbcontroller import GdbController
from pprint import pprint

gdbmi = GdbController()
print(gdbmi.get_subprocess_cmd())  # print actual command run as subprocess

# Load binary a.out and get structured response
pprint(gdbmi.write('-file-exec-file a.exe'))
pprint(gdbmi.write('set new-console on'))
pprint(gdbmi.write('run'))

