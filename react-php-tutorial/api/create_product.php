<?php
// se o form for submetido
if($_POST){
 
    // incluir configurações
    include_once '../config/core.php';
 
    // incluir conexão
    include_once '../config/database.php';
 
    // Objeto produto
    include_once '../objects/product.php';
 
    // Instanciar classes
    $database = new Database();
    $db = $database->getConnection();
    $product = new Product($db);
 
    // Seta valores para as propriedades do produto
    $product->name = $_POST['name'];
    $product->price = $_POST['price'];
    $product->description = $_POST['description'];
    $product->category_id = $_POST['category_id'];
 
    // Criar produto e retornar status
    echo $product->create() ? "true" : "false";
}
?>