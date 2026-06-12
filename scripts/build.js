/**
 * 构建脚本 — 安全压缩 index.html
 * 用法: node scripts/build.js
 * 安全变换：
 *  1. CSS 压缩（去除注释、合并空白）
 *  2. JS：仅去除块注释和缩进，不碰行注释（防破坏字符串）
 *  3. HTML 空白折叠
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'index.html');
const raw = fs.readFileSync(src, 'utf8');
const originalSize = Buffer.byteLength(raw, 'utf8');

let result = raw;

// 1. 压缩 <style> 内的 CSS（安全）
result = result.replace(/<style>[\s\S]*?<\/style>/g, cssBlock => {
  let css = cssBlock
    .replace(/^<style>/, '')
    .replace(/<\/style>$/, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')     // remove CSS comments
    .replace(/;\s+/g, ';')                 // collapse after semicolon
    .replace(/:\s+/g, ':')                 // collapse after colon
    .replace(/,\s+/g, ',')                 // collapse after comma
    .replace(/\s*\{\s*/g, '{')             // collapse around open brace
    .replace(/\s*\}\s*/g, '}')             // collapse around close brace
    .replace(/\s+/g, ' ')                  // collapse all whitespace
    .trim();
  return '<style>' + css + '</style>';
});

// 2. JS：仅安全变换（去除块注释、首尾空白、缩进）
result = result.replace(/<script>[\s\S]*?<\/script>/g, scriptBlock => {
  let js = scriptBlock
    .replace(/^<script>/, '')
    .replace(/<\/script>$/, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')      // remove block comments only
    .replace(/^[ \t]+/gm, '')              // remove leading whitespace
    .replace(/[ \t]+$/gm, '')              // remove trailing whitespace
    .replace(/\n{3,}/g, '\n\n')            // collapse multiple blank lines
    .trim();
  return '<script>' + js + '</script>';
});

// 3. HTML：合并多余空行
result = result.replace(/\n{3,}/g, '\n\n');

const finalSize = Buffer.byteLength(result, 'utf8');
const saved = ((1 - finalSize / originalSize) * 100).toFixed(1);

console.log('  Original: ' + (originalSize / 1024).toFixed(1) + ' KB');
console.log('  Minified: ' + (finalSize / 1024).toFixed(1) + ' KB');
console.log('  Saved:    ' + saved + '%');

fs.writeFileSync(src, result, 'utf8');
console.log('  ✓ index.html updated');
