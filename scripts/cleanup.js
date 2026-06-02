const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git']);
const TRASH_PATTERNS = [
  /\.tmp$/, /\.temp$/, /\.bak$/, /\.old$/, /\.draft$/,
  /^Thumbs\.db$/, /^\.DS_Store$/,
  /\.log$/, /\.tsbuildinfo$/
];

const TARGET_CLEAN_DIRS = ['.next', '.turbo'];

let deletedFilesCount = 0;
let deletedFoldersCount = 0;
let freedBytes = 0;
const reportLines = [];

function log(msg) {
  console.log(msg);
  reportLines.push(msg);
}

function shouldDeleteFile(filePath, fileName, size) {
  // Always delete 0 byte files except configuration files
  if (size === 0 && !fileName.startsWith('.') && !fileName.includes('config')) {
    return '0-byte empty file';
  }
  
  for (const pattern of TRASH_PATTERNS) {
    if (pattern.test(fileName)) {
      return `matches trash pattern ${pattern.toString()}`;
    }
  }
  return null;
}

function cleanRecursively(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    // Skip ignored directories
    if (IGNORE_DIRS.has(file)) {
      continue;
    }
    
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }
    
    if (stats.isDirectory()) {
      // Check if this folder itself is a targeted clean dir (like .next or .turbo)
      if (TARGET_CLEAN_DIRS.includes(file)) {
        deleteFolderRecursive(fullPath, `targeted build artifact folder (${file})`);
      } else {
        cleanRecursively(fullPath);
        
        // Re-read directory to check if it has become empty after cleaning
        const subFiles = fs.readdirSync(fullPath);
        if (subFiles.length === 0) {
          try {
            fs.rmdirSync(fullPath);
            deletedFoldersCount++;
            log(`DELETED EMPTY FOLDER: ${fullPath}`);
          } catch (e) {
            // Directory might be locked or busy
          }
        }
      }
    } else {
      const reason = shouldDeleteFile(fullPath, file, stats.size);
      if (reason) {
        try {
          fs.unlinkSync(fullPath);
          deletedFilesCount++;
          freedBytes += stats.size;
          log(`DELETED FILE: ${fullPath} (Reason: ${reason})`);
        } catch (e) {
          log(`FAILED TO DELETE: ${fullPath}`);
        }
      }
    }
  }
}

function deleteFolderRecursive(folderPath, reason) {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath, reason);
      } else {
        try {
          const size = fs.statSync(curPath).size;
          fs.unlinkSync(curPath);
          deletedFilesCount++;
          freedBytes += size;
        } catch (e) {
          // ignore
        }
      }
    }
    try {
      fs.rmdirSync(folderPath);
      deletedFoldersCount++;
      log(`DELETED DIRECTORY: ${folderPath} (Reason: ${reason})`);
    } catch (e) {
      // ignore
    }
  }
}

log('=== FINOVA DEEP CLEAN & PURGE ===');
log(`Starting cleanup at: ${new Date().toISOString()}`);
log(`Scanning workspace root: ${path.resolve('.')}\n`);

cleanRecursively(path.resolve('.'));

log('\n=== CLEANUP SUMMARY ===');
log(`Total Files Deleted: ${deletedFilesCount}`);
log(`Total Folders Deleted: ${deletedFoldersCount}`);
log(`Space Freed: ${(freedBytes / (1024 * 1024)).toFixed(2)} MB`);
log(`Cleanup Finished Successfully.`);

fs.writeFileSync('cleanup-report.txt', reportLines.join('\n'), 'utf8');
