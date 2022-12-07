import * as style from './style';
import logSymbols from './log_symbols';

export function info(text?: string) {
    console.log(logSymbols.info, `${style.info(text)}`);
}

export function success(text: string) {
    console.log(logSymbols.success, style.success(text));
}

export function warning(text: string) {
    console.log(logSymbols.warning, style.warning(text));
}

export function error(text: string) {
    console.log(logSymbols.error, style.error(text));
}