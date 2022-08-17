const fs = require('fs')

const content = fs.readFileSync('./src/utils/predefined-methods.ts', 'utf8')

fs.writeFileSync('./src/utils/predefined-methods-string.ts', 'export const predefinedMethods = `' + content + '`')