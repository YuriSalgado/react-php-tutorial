<?php
// Se o formulário foi enviado
if($_POST){
 
    // incluir configuração
    include_once '../config/core.php';
 
    // incluir conexão
    include_once '../config/database.php';
 
    // objecto produto
    include_once '../objects/product.php';
 
    // instanciar classes
    $database = new Database();
    $db = $database->getConnection();
    $product = new Product($db);
 
    // seta valores
    $product->name=$_POST['name'];
    $product->description=$_POST['description'];
    $product->price=$_POST['price'];
    $product->category_id=$_POST['category_id'];
    $product->id=$_POST['id'];
 
    // atualiza o produto e retorna
    echo $product->update() ? "true" : "false";
}
?>