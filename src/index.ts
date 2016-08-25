/**
 * Webpack 2.0 plugin for Angular's compiler
 */
import 'core-js/es7/reflect'
import 'zone.js'
import {NgCompilerPlugin} from './plugin'
export {NgCompilerPlugin} from './plugin'
const plugin = NgCompilerPlugin.create({})
import * as ts from 'typescript'
export default function ngLoader(sourceFile){
	let mod = ts.transpileModule(sourceFile, {compilerOptions: { noEmitHelpers: true, module: ts.ModuleKind.ES2015, target: ts.ScriptTarget.ES5}})
	console.log(mod.outputText)
	return mod.outputText;
}
