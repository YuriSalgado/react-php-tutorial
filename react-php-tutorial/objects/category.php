<?php
class Category{
 
    // conexão e nome da tabela
    private $conn;
    private $table_name = "categories";
 
    // propriedades do objeto
    public $id;
    public $name;
 
    public function __construct($db){
        $this->conn = $db;
    }
 
    public function readAll(){
 
        //select all data
        $query = "SELECT id, name FROM categories ORDER BY name";
 
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
 
        $categories=$stmt->fetchAll(PDO::FETCH_ASSOC);
 
        return json_encode($categories);
    }
 
}
?>