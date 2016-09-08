<?php
// incluir onfiguração
include_once '../config/core.php';
 
// incluir configuração banco
include_once '../config/database.php';
 
// Objecto produto
include_once '../objects/product.php';
 
// Instancia classes
$database = new Database();
$db = $database->getConnection();
$product = new Product($db);
 
// leia todos os produtos
$product->id=$_POST['prod_id'];
$results=$product->readOne();
 
// saída no formato JSON
echo $results;
?>