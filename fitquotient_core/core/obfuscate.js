// scripts/obfuscate.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const JavaScriptObfuscate = require('javascript-obfuscator');

function findInputFile() {
  if (process.env.INPUT_FILE) {
    const p = path.resolve(process.env.INPUT_FILE);
    if (fs.existsSync(p)) return p;
    return { error: `INPUT_FILE set but path not found: ${p}` };
  }

  const cwd = process.cwd();
  const dirname = __dirname;
  const candidates = [
    path.join(cwd, 'dist', 'app.js'),
    path.join(cwd, 'dist', 'main.js'),
    path.join(cwd, 'dist', 'bundle.js'),
    path.join(cwd, 'dist', 'index.js'),
    path.join(dirname, '..', 'dist', 'app.js'),
    path.join(dirname, '..', 'dist', 'main.js'),
    path.join(dirname, '..', 'dist', 'bundle.js'),
    path.join(dirname, '..', 'dist', 'index.js'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return { candidates, cwd, dirname };
}

function runObfuscation(code, options) {
  return JavaScriptObfuscate.obfuscate(code, options).getObfuscatedCode();
}

/**
 * Atomic move with EXDEV fallback: try to rename, else copy+unlink
 */
function moveFileAtomic(tmpPath, destPath) {
  try {
    fs.renameSync(tmpPath, destPath);
  } catch (err) {
    // EXDEV = cross-device link not permitted
    if (err && err.code === 'EXDEV') {
      // fallback to copy then unlink
      fs.copyFileSync(tmpPath, destPath);
      fs.unlinkSync(tmpPath);
      return;
    }
    // rethrow other errors
    throw err;
  }
}

(async () => {
  try {
    const found = findInputFile();

    if (found && found.error) {
      console.error('INPUT_FILE error:', found.error);
      process.exit(2);
    }

    if (typeof found === 'string' && fs.existsSync(found)) {
      const input = found;
      const dir = path.dirname(input);
      const output = path.join(dir, 'app.secure.js');

      console.log('Using input file:', input);
      console.log('Final output will be:', output);

      const code = fs.readFileSync(input, 'utf8');

      const reservedNamesArray = [
        '^exports$',
        '^module$',
        '^require$',
        '^process$',
        '^global$',
        '^__dirname$',
        '^__filename$',
        '^__decorate$',
        '^__metadata$',
        '^__param$',
        '^__awaiter$',
        '^__generator$',
        '^Reflect$',
      ];

      // aggressive options (try first)
      const aggressiveOptions = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.9,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.6,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'mangled',
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['rc4', 'base64'],
        stringArrayThreshold: 0.9,
        rotateStringArray: true,
        transformObjectKeys: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        debugProtection: true,
        // debugProtectionInterval expects a number (ms). Set to >=0, e.g. 1000 (1s).
        debugProtectionInterval: 1000,
        sourceMap: false,
        reservedNames: reservedNamesArray,
        seed: Math.floor(Math.random() * 0xffffffff),
      };

      // fallback safe options
      const safeOptions = {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        selfDefending: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.5,
        rotateStringArray: false,
        sourceMap: false,
        reservedNames: reservedNamesArray,
      };

      let obfCode = null;
      try {
        console.log('Attempting obfuscation (aggressive)...');
        obfCode = runObfuscation(code, aggressiveOptions);
        console.log('Aggressive obfuscation succeeded.');
      } catch (err) {
        console.warn('Aggressive obfuscation failed, trying safe mode...');
        console.warn(err && err.message ? err.message : err);
        try {
          obfCode = runObfuscation(code, safeOptions);
          console.log('Safe obfuscation succeeded.');
        } catch (err2) {
          console.error('Both obfuscation modes failed:');
          console.error(err2 && err2.message ? err2.message : err2);
          process.exit(1);
        }
      }

      // write to temp file then move (with EXDEV fallback)
      const tmpFile = path.join(os.tmpdir(), `app.secure.${Date.now()}.tmp.js`);
      fs.writeFileSync(tmpFile, obfCode, 'utf8');

      try {
        moveFileAtomic(tmpFile, output);
      } catch (moveErr) {
        console.error(
          'Failed to move temp file to output:',
          moveErr && moveErr.message ? moveErr.message : moveErr,
        );
        // try to clean tmp if exists
        try {
          if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
        } catch (_) {}
        process.exit(1);
      }

      console.log('Obfuscated file written to:', output);

      // delete original app.js (no backups)
      try {
        fs.unlinkSync(input);
        console.log('Original removed:', input);
      } catch (e) {
        console.warn(
          'Warning: could not remove original file:',
          e && e.message ? e.message : e,
        );
      }

      process.exit(0);
    } else {
      const { candidates, cwd, dirname } = found;
      console.error('Error: input file not found. Searched these paths:');
      candidates.forEach((c) => console.error('  -', c));
      console.error('\nCurrent working dir (process.cwd()):', cwd);
      console.error('__dirname (scripts folder):', dirname);
      console.error(
        '\nYou can override with: INPUT_FILE=/abs/path/to/dist/app.js node scripts/obfuscate.js',
      );
      process.exit(2);
    }
  } catch (err) {
    console.error('Obfuscation failed:');
    if (err && err.message) console.error(err.message);
    if (err && err.stack)
      console.error(err.stack.split('\n').slice(0, 6).join('\n'));
    process.exit(1);
  }
})();
