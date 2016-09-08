<?php
class Product{
 
    // conexão e nome da tabela
    private $conn;
    private $table_name = "products";
 
    // propriedades do objeto
    public $id;
    public $name;
    public $price;
    public $description;
    public $category_id;
    public $timestamp;
 
    public function __construct($db){
        $this->conn = $db;
    }
	
	public function readAll(){
 
        //select all data
        $query = "SELECT p.id, p.name, p.description, p.price, p.category_id, c.name as category_name
                FROM " . $this->table_name . " p LEFT JOIN categories c ON p.category_id=c.id ORDER BY name";
 
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
 
        $categories=$stmt->fetchAll(PDO::FETCH_ASSOC);
 
        return json_encode($categories);
    }
 
    public function create(){
        try{
 
            // insert query
            $query = "INSERT INTO products
                SET name=:name, description=:description, price=:price, category_id=:category_id, created=:created";
 
            // prepara query para executar
            $stmt = $this->conn->prepare($query);
 
            // limpar
            $name=htmlspecialchars(strip_tags($this->name));
            $description=htmlspecialchars(strip_tags($this->description));
            $price=htmlspecialchars(strip_tags($this->price));
            $category_id=htmlspecialchars(strip_tags($this->category_id));
 
            // setar os parâmetros
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':category_id', $category_id);
 
            // Precisamos da variável criada para saber quando o registro foi criado
			$created=date('Y-m-d H:i:s');
			$stmt->bindParam(':created', $created);
 
            // Executar a query
            if($stmt->execute()){
                return true;
            }else{
                return false;
            }
 
        }
 
        // Mostrar caso aja erro
        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }
	
	public function readOne(){ 
		// selecionar um registro
		$query = "SELECT p.id, p.name, p.description, p.price, p.category_id, c.name as category_name
					FROM " . $this->table_name . " p LEFT JOIN categories c ON p.category_id=c.id
					WHERE p.id=:id";

		// prepara query para executar
		$stmt = $this->conn->prepare($query);

		$id=htmlspecialchars(strip_tags($this->id));
		$stmt->bindParam(':id', $id);
		$stmt->execute();

		$results=$stmt->fetchAll(PDO::FETCH_ASSOC);

		return json_encode($results);
	}
	
	public function update(){
		$query = "UPDATE products
					SET name=:name, description=:description, price=:price, category_id=:category_id
					WHERE id=:id";

		$stmt = $this->conn->prepare($query);

		$name=htmlspecialchars(strip_tags($this->name));
		$description=htmlspecialchars(strip_tags($this->description));
		$price=htmlspecialchars(strip_tags($this->price));
		$category_id=htmlspecialchars(strip_tags($this->category_id));
		$id=htmlspecialchars(strip_tags($this->id));

		$stmt->bindParam(':name', $name);
		$stmt->bindParam(':description', $description);
		$stmt->bindParam(':price', $price);
		$stmt->bindParam(':category_id', $category_id);
		$stmt->bindParam(':id', $id);

		if($stmt->execute()){
			return true;
		}else{
			return false;
		}
	}
	
	// excluir produtos selecionados
	public function delete($ins){

		// query para excluir vários registros
		$query = "DELETE FROM products WHERE id IN (:ins)";

		$stmt = $this->conn->prepare($query);

		// sanitize
		$ins=htmlspecialchars(strip_tags($ins));

		// bind the parameter
		$stmt->bindParam(':ins', $ins);

		if($stmt->execute()){
			return true;
		}else{
			return false;
		}
	}
}