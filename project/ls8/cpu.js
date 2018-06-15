/**
 * LS-8 v2.0 emulator skeleton code
 */
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const PUSH = 0b01001101;
const POP = 0b01001100;
const RET = 0b00001001;
const CALL = 0b01001000;
const ADD = 0b10101000;
const CMP = 0b10100000;
const JEQ = 0b01010001;
const JMP = 0b01010000;
const JNE = 0b01010010;

let SP = 0x07;
// let IS = 0x06;
// let IM = 0x05;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    
    this.reg = new Array(8).fill(0);
    // General-purpose registers R0-R7
    this.reg[SP] = 0xf4;
    // Special-purpose registers
    this.PC = 0; // Program Counter
    // sets place in stack
    //*********************** MY FLAGS */
    this.FLAGE = 0; // equal
    this.FLAGG = 1; // greater
    this.FLAGL = 2; //less
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case MUL:
        this.reg[regA] = this.reg[regA] * this.reg[regB];
        this.PC += 3;
        break;
      case ADD:
        this.reg[regA] = this.reg[regA] + this.reg[regB];
        this.PC += 3;

        break;

      default:
        console.log(`unknown instruction${op.toString(2)}`);
        this.stopClock();
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)
    const IR = this.ram.read(this.PC);
    // !!! IMPLEMENT ME

    // Debugging output
    //console.log(`${this.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.
    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    switch (IR) {
      case LDI:
        this.reg[operandA] = operandB;
        this.PC += 3;
        break;
      case PRN:
        console.log("Printed:",this.reg[operandA]);
        this.PC += 2;
        break;
      case HLT:
        this.stopClock();
        this.PC += 1;
        break;
      case PUSH:
        this.pushElement(this.reg[operandA]);
        this.PC += 2;
        break;
      case POP:
        // this.reg[operandA] = this.ram.read(this.reg[SP]);
        this.popElement(operandA);
        this.PC += 2;
        break;
      case CALL:
        this.reg[SP]--;
        this.poke(this.reg[SP], this.PC + 2);
        this.PC = this.reg[operandA];
        break;
      case RET:
        this.PC = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
        break;
      case CMP:
 
        if (this.reg[operandA] === this.reg[operandB]) {
       // console.log(this.FLAGE)
          this.FLAGE = 1;
          this.PC+=3
        } else {
         // console.log(this.FLAGE)
          this.FLAGE = 0;
          this.PC+=3
        }
        break;
      case JMP: 
      //console.log("worked jmp")

        this.PC = this.reg[operandA];
        break;
      case JEQ:
     // console.log("i worked jeq")
        if (this.FLAGE === 1) {
        //  console.log("worked jeq",this.FLAGE)
          this.PC = this.reg[operandA];
        } else {
          this.PC += 2;
        }
        break;
      case JNE:
     // console.log("i worked jne")
    
        if (this.FLAGE === 0) {
        
        //  console.log("worked jne",this.FLAGE)
          this.PC = this.reg[operandA];
        } else {
          this.PC += 2;
        }
        break;
      default:
        this.alu(IR, operandA, operandB);
        break;
    }
  }
  // Increment the PC register to go to the next instruction. Instructions
  // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
  // instruction byte tells you how many bytes follow the instruction byte
  // for any particular instruction.
  pushElement(e) {
    this.reg[SP]--;
    this.poke(this.reg[SP], e);
  }
  popElement(e = null) {
    console.loge;
    if (e === null) {
      const newVar = this.ram.read(this.reg[SP]);
      this.reg[SP]++;

      return newVar;
    }
    this.reg[e] = this.ram.read(this.reg[SP]);

    this.reg[SP]++;
    return e;
  }
  // callElement(e){
  //   this.reg[SP]--
  //   this.ram.write(this.reg[SP], this.reg.PC+2)
  //   const element = this.reg[e]
  //   return element;
  // }
}

module.exports = CPU;
