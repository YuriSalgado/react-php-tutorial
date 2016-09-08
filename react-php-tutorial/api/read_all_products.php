<?php
// incluir arquivo de configuração
include_once '../config/core.php';
 
// incluir conexão com banco
include_once '../config/database.php';
 
// incluir objeto categoria
include_once '../objects/product.php';
 
// instanciar classes
$database = new Database();
$db = $database->getConnection();
$product = new Product($db);
 
// ler todos produtos
$results=$product->readAll();
 
// saída no formato JSON
echo $results;
?>