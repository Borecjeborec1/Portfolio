const fs = require('fs');
const path = require('path');

function readDirRecursive(dir) {
  const files = {};

  const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of dirEntries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name != ".git") {
      files[entry.name + "/"] = readDirRecursive(entryPath);
    }
    else if (entry.isFile()) {
      let stats = fs.statSync(entryPath)
      if (entry.name == "Thumbs.db")
        continue
      console.log(entry.name)
      files[entry.name] = {
        properties: {
          size: stats.size,
          isFile: true,
          path: `https://raw.githubusercontent.com/ROGR3/Portfolio/main/${entryPath}`,
        }
      };
    }
  }
  return files;
}

fs.writeFileSync("./scripts/lib/virtualfs.js", "export const VIRTUAL_FS = " + JSON.stringify(readDirRecursive('.')))
