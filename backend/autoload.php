<?php

spl_autoload_register(function ($className) {
    $prefix = 'Garden\\';
    $baseDir = __DIR__ . '/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $className, $len) !== 0) {
        return; 
    }

    $relativeClass = substr($className, $len);

    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});