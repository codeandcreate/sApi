#!/bin/bash
if [ -z "$1" ]; then
    echo "Error: File/path of api to build not given"
    exit
fi
if [ ! -e "$1" ]; then
	echo "Error: File not found"
	exit
fi

inputFileName=$1
baseApiFileName=$(basename $inputFileName)
baseApiFileName="${baseApiFileName:0:${#baseApiFileName}-3}"
basePath=$(dirname $inputFileName)/
modulePath=$basePath$baseApiFileName'_modules/'
moduleData=""
prePath=$basePath$baseApiFileName'_pre/'
preData=""

if [ ! -e $modulePath ]; then
	echo "Error: The modulepath $modulePath doesn't exists"
	exit
fi

if [ ! -e $prePath ]; then
	echo "Error: The prepath $prePath doesn't exists"
	exit
fi

echo "Building $baseApiFileName..."

cd "$basePath"

for filename in $(ls $prePath/*.js); do
	tmp=`cat $filename`
	echo "- included pre javascript: $(basename $filename)"
	preData="$preData$tmp"
done

for filename in $(ls $modulePath/*.js); do
	tmp=`cat $filename`
	tmp="${tmp/\$s.extend({/}"
	tmp="${tmp:0:${#tmp}-3}"
	echo "- included module: $(basename $filename)"
	moduleData="$moduleData$tmp,"
done

baseApi=`cat $baseApiFileName.js`
baseApi="${baseApi/'_includeModulesPlaceHolder: {},'/$moduleData}"

echo "$preData" > $baseApiFileName.min.js
echo "$baseApi" >> $baseApiFileName.min.js

echo "Build done. compressing..."

if hash php 2>/dev/null && [ -f "./tools/packer/class.JavaScriptPacker.php" ];  then
  echo "- using php / packer"
  php ./tools/packer/packer.php $baseApiFileName.min.js
elif hash yuicompressor 2>/dev/null; then
  echo "- using yuicompressor"
  yuicompressor $baseApiFileName.min.js -o $baseApiFileName.min.js
elif hash yui-compressor 2>/dev/null; then
  echo "- using yui-compressor"
  yui-compressor $baseApiFileName.min.js -o $baseApiFileName.min.js
else
  echo "- Warning: no compressor found..."
fi

echo "$baseApiFileName.min.js builded"
