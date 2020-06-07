#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

async function createFile (file, replacer) {
  const srcFile = path.resolve(__dirname, '..', file);
  let content = await fs.promises.readFile(srcFile, { encoding: 'utf-8' });
  if (replacer) {
    content = replacer(content);
  }
  const desFile = path.resolve(projectName, file);
  return fs.promises.writeFile(desFile, content, { encoding: 'utf-8' });
}

if (!projectName) {
  console.error('No project name specified.');
  process.exit(-1);
} else {
  console.log(`Create project ${projectName}...`);
  const projectDir = path.resolve('.', projectName);
  if (fs.existsSync(projectDir)) {
    console.error(`${projectName} already exists!`);
    process.exit(-1);
  }
  fs.mkdirSync(projectDir);

  createFile('package.json', (content) => {
    const config = JSON.parse(content);
    delete config.bin;
    config.name = projectName;
    config.version = '0.0.1';
    return JSON.stringify(config, null, 2);
  });
  createFile('.babelrc');
  createFile('.eslintrc.js');
  createFile('webpack.config.js');

  fs.mkdirSync(path.resolve(projectDir, 'src'));
  createFile('src/index.js');
  createFile('src/index.test.js');
}
