#!/usr/bin/env node
import * as log from '../utils/utils';

const program = require('commander');
const version = require('../../package.json').version


function checkVersion() {
    // v10.12.0++
    const suggestVersion = '10.12.0';
    const nodeVersion = process.versions.node;
    if (
        parseInt(nodeVersion.split('.')[0]) < parseInt(suggestVersion.split('.')[0])
    ) {
        log.info(`当前 Node 版本：v${nodeVersion}`);
        log.info(`建议 Node 版本：v${suggestVersion}++`);
        log.warning('Node 版本过低可能会导致脚手架无法运行');
    }
}



checkVersion();
program
    .version(require('../../package.json').version)
    .usage('<command> [options]')
    .option('-L, --ls', 'output template list')
    .command('init', '从模板生成一个新项目')
    .parse(process.argv);

if (program.ls) {
    console.log();
    console.log('  template:');
    const templates = require('../../package.json').lowbTemplates;
    const version = require('../../package.json').version;
    for (let i = 0; i < templates.length; i++) {
        log.info();
        log.info('    ' + (i + 1) + '. ' + templates[i].name);
        log.info('    ' + '   ---  ' + templates[i].info);
    }
    console.log();
}
