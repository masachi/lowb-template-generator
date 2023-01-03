#!/usr/bin/env node
const download = require('download-git-repo');
const program = require('commander');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');
const os = require('os');
const ora = require('ora');
const rm = require('rimraf').sync;

program
  .usage('[project-name]')
  .option('-c, --clone', 'use git clone');

/**
 * Help.
 */

function help () {
  program.parse(process.argv);
  if (program.args.length < 1) return program.help();
}
help();

/**
 * Settings.
 */
const rawName = program.args[0];
const inPlace = !rawName || rawName === '.';
const projectName = inPlace ? path.relative('../', process.cwd()) : rawName;
const to = path.resolve(rawName || '.');
const clone = program.clone || false;

if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? '在当前目录中生成项目？'
      : '目标目录存在。继续吗？',
    name: 'ok'
  }])
  .then((answers: any) => {
    if (answers.ok) {
      rm(to);
      main();
    }
  });
} else {
  main();
}

function main() {
  const lowbTemplates = require('../../package.json').lowbTemplates;
  const templates = [];
  for (let i = 0; i < lowbTemplates.length; i++) {
    templates[i] = lowbTemplates[i].name;
  }
  inquirer.prompt([{
    type: 'list',
    message: '请选择使用的模板',
    choices: templates,
    name: 'template'
  }])
  .then((answers: any) => {
    console.log(answers.template);
    if (answers.template) {
      createApplication(answers.template, projectName, to);
    }
  });
}

/**
 * Create application at the given directory `path`.
 *
 * @param template
 * @param app_name
 * @param {string} path
 */

function createApplication(template: string, app_name: any, path: string) {
  mkdir(path, () => {
    downloadAndGenerate(template, path);
  });
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path: string, fn: any) {
  mkdirp(path, {mode: 0o755}).then((path: string | null) => {
    console.log('   \033[36m创建目录\033[0m : ' + path);
    fn && fn();
  }).catch((error: any) => {
    throw error;
  });
}

/**
 * Download a generator from a template repo.
 *
 * @param {string} template
 * @param path
 */

function downloadAndGenerate (template: string, path: any) {
  const spinner = ora('下载模板ING');
  spinner.start();
  download('masachi/umi-template#template', path, { clone: clone }, (err: any) => {
    spinner.stop();
    if (err) console.error('未能下载模板' + template + ': ' + err.message.trim());
    console.log();
    console.log('创建完成 "%s".', projectName);
    console.log();
  });
}