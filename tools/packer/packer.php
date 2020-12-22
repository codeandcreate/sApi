<?php
// you can pass this script to PHP CLI to convert your file.
$out = $src = $argv[1];

require dirname(__FILE__) . '/class.JavaScriptPacker.php';

$script = file_get_contents($src);
$packer = new JavaScriptPacker($script, 'Normal', true, false);
$packed = $packer->pack();

file_put_contents($out, $packed);
?>
