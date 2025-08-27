const crypto = require('crypto');
const fs = require('fs');

const PASSWORD = '0000';                 // activation code
const INPUT = 'JmpaoJSgforO.exe';        // original exe name
const OUTPUT = INPUT + '.bin';

function padZeroes16(buf) {
  const blockSize = 16; // AES block size
  const padLen = blockSize - (buf.length % blockSize);
  return Buffer.concat([buf, Buffer.alloc(padLen, 0)]);
}

function encryptFile(inputPath, outputPath, password) {
  // key = SHA-256(password)
  const key = crypto.createHash('sha256').update(password, 'utf8').digest(); // 32 bytes
  const data = fs.readFileSync(inputPath);
  const padded = padZeroes16(data);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  cipher.setAutoPadding(false); // we already did zero padding

  const ciphertext = Buffer.concat([cipher.update(padded), cipher.final()]);
  fs.writeFileSync(outputPath, Buffer.concat([iv, ciphertext]));
  console.log(`Encrypted -> ${outputPath}`);
}

if (require.main === module) {
  encryptFile(INPUT, OUTPUT, PASSWORD);
}