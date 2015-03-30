<?php

$base_dir  = 'file:///' . dirname(dirname(__DIR__));
$path = $base_dir . '/' . $_GET['bucket'];

if (!file_exists($path)) {
    mkdir($path, 0766, true);
}

$uploaded = array();
foreach ($_FILES['files']['name'] as $k => $filename) {
    $tmp_file = $_FILES['files']['tmp_name'][$k];
    $filename = md5($tmp_file);

    $upload = move_uploaded_file($tmp_file, $path.$filename);

    $uploaded[] = array(
        'base' => $_GET['base'],
        'path' => $_GET['bucket'],
        'filename' => $filename
    );
}

echo json_encode($uploaded);
exit();
