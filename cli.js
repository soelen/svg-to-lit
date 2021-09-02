#!/usr/bin/env node

import { optimize } from 'svgo';
import glob from 'glob';

import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { constantify, camelize } from 'inflected';

const [,, ...args] = process.argv;

const help = args.findIndex( arg => arg === '--help' || arg === '-h' );
const compressIndex = args.findIndex( arg => arg === '--compress' || arg === '-c' );

const exitWithSomeHelp = () => {
	console.log( '-i | --input:  Specify input. Glob patterns are possible. This parameter is required.' )
	console.log( '-o | --output: Specify output. This parameter is required.' )
	console.log( '-c | --compress: Compress / Optimize svg in the process.' )
	console.log( '-h | --help: Call this fancy help once again.' )

	process.exit();
}

if( help >= 0 ) exitWithSomeHelp();

const inputIndex = args.findIndex( arg => arg === '--input' || arg === '-i' ) + 1;
const outputIndex = args.findIndex( arg => arg === '--output' || arg === '-o' ) + 1;

if( !inputIndex || !args[ inputIndex ] ) exitWithSomeHelp();
if( !outputIndex || !args[ outputIndex ] ) exitWithSomeHelp();


glob( args[ inputIndex ], ( error, files ) => {

	const data = files
	.map( file => ({ path: file, buffer: readFileSync( file ) }) )
	.map( data => ({ path: data.path, svg: data.buffer.toString()}))
	.map( data => {
		return compressIndex > 0
		? optimize( data.svg, { multipass: true, path: data.path } )
		: { data: data.svg, path: data.path };
	} );

	writeFileSync( args[ outputIndex ], `
// Do not modify this file by hand!
// Re-generate this file by running svg-to-lit

import { svg } from 'lit';
${ data.map( data => `export const ${ camelize( constantify( path.parse( data.path ).name ).toLowerCase(), false ) } = svg\`${ data.data }\`\n` ).join( '' ) }`
)
});