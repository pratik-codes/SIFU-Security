import r2pipe

# Open the binary in Radare2
r2 = r2pipe.open('dump.so')

# Set architecture to BPF and analyze
r2.cmd('e asm.arch=bpf')
r2.cmd('aaa')

# Get function list
functions = r2.cmd('afl')
print("Functions found:")
print(functions)

# Get disassembly of the entire binary (or first 1000 instructions for brevity)
disassembly = r2.cmd('pdi 1000')
print("Disassembly:")
print(disassembly)

# Optionally, save the disassembly to a file
with open('disassembly.txt', 'w') as f:
    f.write("Functions:\n")
    f.write(functions)
    f.write("\nDisassembly:\n")
    f.write(disassembly)

# Close Radare2
r2.quit()
