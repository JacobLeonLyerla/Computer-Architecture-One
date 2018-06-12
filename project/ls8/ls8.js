const RAM = require("./ram");
const CPU = require("./cpu");
const fs = require("fs");

const argv2 = process.argv[2];

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */


const grabNumbers = /[0-1]{8}/g
const programFile = fs.readFileSync(argv2, "utf-8").match(grabNumbers)


function loadMemory() {
  // Hardcoded program to print the number 8 on the console
const program = []

programFile.forEach(data =>program.push(data))



  // Load the program into the CPU's memory a byte at a time
  for (let i = 0; i < program.length; i++) {
    cpu.poke(i, parseInt(program[i], 2));
  }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();
