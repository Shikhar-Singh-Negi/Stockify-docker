const fs = require('fs');
const path = require('path');

const directoryPath = 'c:/Users/khoon/OneDrive/Desktop/Project/stockify/frontend/src/pages';

fs.readdirSync(directoryPath).forEach(file => {
  if (path.extname(file) === '.jsx') {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('FormattedTime "')) {
      console.log(`Fixing ${file}...`);
      content = content.replace(/FormattedTime "/g, 'FormattedTime"');
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
