import * as tscWrapped from '@angular/tsc-wrapped'
import * as ngCore from '@angular/core'
import * as ngc from '@angular/compiler-cli'
import * as ts from 'typescript'

import {MetadataWriterHost, DelegatingHost} from '@angular/tsc-wrapped/src/compiler_host'

export class WebpackNgCompilerHost extends DelegatingHost {
	getDirectories(path){
		return ts.sys.getDirectories(path);
	}
}

export const TS_CONFIG = new ngCore.OpaqueToken('TS_CONFIG');
export const TS_COMPILER_HOST = new ngCore.OpaqueToken('TS_COMPILER_HOST');
export const TS_CONFIG_PATH = new ngCore.OpaqueToken('TS_CONFIG_PATH');

export class WebpackCompilerHost implements ts.CompilerHost {
	files = {}
	constructor(public tsconfig, public webpackCompiler:any){

	}
  getSourceFile(fileName, langVersion){

	  let file  = this.files[fileName];
	  if(!file){
		  file = ts.sys.readFile(fileName);
		  if(!file){
			  file = ts.sys.readFile(ts.getDefaultLibFilePath({}));
		  }
		}
	  return ts.createSourceFile(fileName, file, langVersion);
  }
  useCaseSensitiveFileNames = () => ts.sys.useCaseSensitiveFileNames;
  getDefaultLibFileName = () => "lib.d.ts";
  writeFile(path, source){
	  console.log('writing file', path)
	  this.files[path] = source;
  }
  getCurrentDirectory(){
	  console.log('get current directory ',ts.sys.getCurrentDirectory());
	  return ts.sys.getCurrentDirectory();
  }
  getCanonicalFileName(f:string){
	  return ts.sys.useCaseSensitiveFileNames ? f : f.toLowerCase();
  }
  getNewLine = () => ts.sys.newLine;
  fileExists = fileName => ts.sys.fileExists(fileName);
  readFile = fileName => {
	  console.log('read file', fileName, ts.sys.readFile(fileName))
	  return ts.sys.readFile(fileName)
  };
  trace = (s: string) => ts.sys.write(s + ts.sys.newLine);
  directoryExists = directoryName => {
	  console.log('directroy exists', directoryName, ts.sys.directoryExists(directoryName))
	  return ts.sys.directoryExists(directoryName);
  };
  getDirectories =( path: string) => ts.sys.getDirectories(path);
}

export class WebpackMetadataWriterHost extends WebpackCompilerHost implements MetadataWriterHost {
}

export function _compilerHostFactory(tsConfig){
	console.log(tsConfig)
	return (webpackCompiler) => {
		return new ngc.ReflectorHost(tsConfig.config.compilerOptions, webpackCompiler)
	}
}

export function _tsConfigFactory(configFilePath){
	let config = ts.readConfigFile(configFilePath, ts.sys.readFile);
	return config;
}

export default function(tsconfigPath){
	return [
	  { provide: TS_CONFIG_PATH, useValue: tsconfigPath },
	  { provide: TS_CONFIG, useFactory: _tsConfigFactory, deps: [TS_CONFIG_PATH]},
	  { provide: TS_COMPILER_HOST, useFactory: _compilerHostFactory, deps: [ TS_CONFIG ]}
   ]
}
