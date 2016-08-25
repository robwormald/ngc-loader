import * as webpack from 'webpack'
import * as ngCore from '@angular/core'
import * as platformBrowser from '@angular/platform-browser'
import * as platformServer from '@angular/platform-server'
import * as ts from 'typescript'
import * as ngCompiler from '@angular/compiler-cli'
import * as fs from 'fs'
import * as path from 'path'

import {default as getCompilerHost, _compilerHostFactory, TS_COMPILER_HOST, TS_CONFIG, WebpackNgCompilerHost} from './compiler_host'

let compilerPluginInstance:boolean | any = false;

export type CompilerMode = 'jit' | 'aot'

export const wrapCallback = (cb) => {
	return (thenable) => {
		thenable
		  .then(_ => cb(), err => cb(err));
	}
}

export interface NgCompilerPluginOptions {
	compilerMode: CompilerMode;
	rootNgModule: string;
}

export class NgCompilerPlugin {
	fileCache = {}
	platformRef: ngCore.PlatformRef;
	moduleRef: ngCore.NgModuleRef<any>;
	waitForBootstrap: Promise<ngCore.NgModuleRef<any>>;
	constructor(public options: NgCompilerPluginOptions) {


	}

	compile(source){

	}

	bootstrap(compiler){
		return Promise.resolve(compiler)
	}

	static create(options){
		if(compilerPluginInstance){
			return compilerPluginInstance;
		}
		compilerPluginInstance = new NgCompilerPlugin(options);
		return compilerPluginInstance;
	}

	apply(compiler) {

		compiler.plugin('run', (compiler, cb) => this._runHandler(compiler, cb));
		compiler.plugin('watch-run', (compiler, cb) => this._watchRunHandler(compiler, cb));

		// compiler.plugin('compile', (params, cb) => {

		// });

		// compiler.plugin('make', compilation => {

		// })

		// compiler.plugin("compilation", function (compilation, options, cb) {
		// 	console.log("The compiler is starting a new compilation...", cb);

		// 	compilation.plugin("optimize", function () {
		// 		console.log("The compilation is starting to optimize files...");
		// 	});
		// });

		// compiler.plugin("emit", function (compilation, callback) {
		// 	console.log("The compilation is going to emit files...");
		// 	callback();
		// });
	}

	private _createCompilerHost(options): ts.CompilerHost {
		let delegate = ts.createCompilerHost(options);

		// delegate.writeFile = (filePath, data) => {
		// 	console.info('write:', filePath);
		// 	this.fileCache[filePath] = data;
		// }

		return delegate;
	}

	private _initialize(compiler){
		return this.bootstrap(compiler)
		  .then(() => {
			  let configFile = ts.readConfigFile('tsconfig.json', (f) => ts.sys.readFile(f))
			 let host = this._createCompilerHost(configFile)


			  let program = ts.createProgram([compiler.options.entry], configFile.config.compilerOptions, host);


			  let reflectorHost = new ngCompiler.MetadataWriterHost(host, program)
			  const codeGenerator = ngCompiler.CodeGenerator.create({

				  genDir: 'src/ngfactory',
				  rootDir: 'src',
				  basePath: compiler.options.context,
				  skipMetadataEmit: false,
				  skipDefaultLibCheck: true,
				  skipTemplateCodegen: false,
				  trace: true,
			  }, program, host);


			  return codeGenerator.codegen().then((args) => {
				  console.log('codegen done')
				  return host;
			  }).catch(err => console.error(err))

		  });
	}

	private _compile(){}

	private _readConfigFile(basePath, configFilePath){
		// return Promise.resolve(tscWrapped.tsc.readConfiguration(configFilePath, basePath));
	}
	private _runHandler(compiler, cb){
		//wait for angular to bootstrap

		wrapCallback(cb)(this._initialize(compiler));
	}
	private _watchRunHandler(compiler, cb){
		console.log(compiler, cb)
		//wait for angular to bootstrap
		wrapCallback(cb)(this._initialize(compiler.compiler));
	}
	private _compilation(){}
}
