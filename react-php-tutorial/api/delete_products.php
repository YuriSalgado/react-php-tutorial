<?php
// Se o formulário foi enviado
if($_POST){
 
    // incluir configuracao
    include_once '../config/core.php';
 
    // incluir conexao
    include_once '../config/database.php';
 
    // objeto produto
    include_once '../objects/product.php';
 
    // instanciar classes
    $database = new Database();
    $db = $database->getConnection();
    $product = new Product($db);
 
    $ins="";
    foreach($_POST['del_ids'] as $id){
        $ins.="{$id},";
    }
 
    $ins=trim($ins, ",");
 
    // delete the product
    echo $product->delete($ins) ? "true" : "false";
}
?>