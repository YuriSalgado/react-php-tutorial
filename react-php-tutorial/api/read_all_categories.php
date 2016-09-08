<?php
// incluir arquivo de configuração
include_once '../config/core.php';
 
// incluir conexão com banco
include_once '../config/database.php';
 
// incluir objeto categoria
include_once '../objects/category.php';
 
// instanciar classes
$database = new Database();
$db = $database->getConnection();
$category = new Category($db);
 
// ler todas categorias
$results=$category->readAll();
 
// saída no formato JSON
echo $results;
?>