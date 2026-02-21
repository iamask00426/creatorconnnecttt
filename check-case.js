import fs from 'fs';
import path from 'path';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    if (!list.length) return done(null, results);
    
    // Explicitly ignore node_modules and .git
    if (dir.includes('node_modules') || dir.includes('.git')) {
        return done(null, results);
    }
    
    let pending = list.length;
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.match(/\.(js|jsx|ts|tsx)$/)) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('.', function(err, results) {
  if (err) throw err;
  let errors = 0;
  results.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?\s+from\s+['"](\..*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const dir = path.dirname(file);
      const resolved = path.resolve(dir, importPath);
      
      // Check if file exists in case-sensitive way
      const checkPath = (p) => {
          let currentDir = path.dirname(p);
          let basename = path.basename(p);
          try {
              const files = fs.readdirSync(currentDir);
              // if it doesn't have an extension, try to find matches
              if (!path.extname(basename)) {
                  const matchExt = files.find(f => f.startsWith(basename + '.') || f === basename || f === basename + '/index.ts' || f === basename + '/index.tsx' || f === basename + '/index.js');
                  if (!matchExt && !files.includes(basename)) {
                     // Need more complex resolution, but let's just check if case matches exactly if found
                     const caseInsensitiveMatch = files.find(f => f.toLowerCase().startsWith(basename.toLowerCase()));
                     if (caseInsensitiveMatch && !caseInsensitiveMatch.startsWith(basename)) {
                         console.log(`Case mismatch in ${file}: imports '${importPath}' but file is '${caseInsensitiveMatch}'`);
                         errors++;
                     }
                  }
              } else {
                  if (!files.includes(basename)) {
                      const caseInsensitiveMatch = files.find(f => f.toLowerCase() === basename.toLowerCase());
                      if (caseInsensitiveMatch) {
                          console.log(`Case mismatch in ${file}: imports '${importPath}' but file is '${caseInsensitiveMatch}'`);
                          errors++;
                      }
                  }
              }
          } catch(e) {}
      };
      checkPath(resolved);
    }
  });
  if (errors === 0) console.log("No obvious case mismatches found.");
});
