const fs = require('fs');
const path = require('path');

// 创建目录（如果不存在）
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
}

// 复制文件
function copyFile(source, destination) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(destination, data);
    console.log(`成功复制文件: ${source} -> ${destination}`);
  } catch (err) {
    console.error(`复制文件失败 ${source} -> ${destination}:`, err);
  }
}

// 复制目录
function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    console.error(`源目录不存在: ${source}`);
    return;
  }

  ensureDirectoryExists(destination);

  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  });
  console.log(`成功复制目录: ${source} -> ${destination}`);
}

// 项目根目录
const rootDir = path.resolve(__dirname, '../..');
const publicDir = path.join(__dirname, '../public');

// 确保 public 目录存在
ensureDirectoryExists(publicDir);

// 1. 复制 markdown_yml 目录到 public/markdown_yml
const yamlSourceDir = path.join(rootDir, 'markdown_yml');
const yamlDestDir = path.join(publicDir, 'markdown_yml');
if (fs.existsSync(yamlSourceDir)) {
  copyDirectory(yamlSourceDir, yamlDestDir);
} else {
  console.error(`markdown_yml 目录不存在: ${yamlSourceDir}`);
}

// 2. 复制 all_word.txt 文件到 public 目录
const allWordFilePath = path.join(rootDir, 'all_word.txt');
const allWordDestPath = path.join(publicDir, 'all_word.txt');
if (fs.existsSync(allWordFilePath)) {
  copyFile(allWordFilePath, allWordDestPath);
} else {
  // 尝试从 aidict-web 目录复制
  const alternativeAllWordPath = path.join(rootDir, 'aidict-web', 'all_word.txt');
  if (fs.existsSync(alternativeAllWordPath)) {
    copyFile(alternativeAllWordPath, allWordDestPath);
  } else {
    console.error(`all_word.txt 文件不存在，尝试了以下路径:`, allWordFilePath, alternativeAllWordPath);
  }
}

// 3. 复制 wordtxt 目录（如果存在）
const wordTxtSourceDir = path.join(rootDir, 'wordtxt');
const wordTxtDestDir = path.join(publicDir, 'wordtxt');
if (fs.existsSync(wordTxtSourceDir)) {
  copyDirectory(wordTxtSourceDir, wordTxtDestDir);
} else {
  const alternativeWordTxtDir = path.join(rootDir, 'aidict-web', 'wordtxt');
  if (fs.existsSync(alternativeWordTxtDir)) {
    copyDirectory(alternativeWordTxtDir, wordTxtDestDir);
  } else {
    console.error(`wordtxt 目录不存在，尝试了以下路径:`, wordTxtSourceDir, alternativeWordTxtDir);
  }
}

console.log('所有数据文件复制完成！');