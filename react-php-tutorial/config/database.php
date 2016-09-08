<?php
class Database{
 
    // especificar as suas próprias credenciais de banco de dados
    private $host = "localhost";
    private $db_name = "php_react_crud";
    private $username = "root";
    private $password = "";
    public $conn;
 
    // obter a conexão de banco de dados
    public function getConnection(){
 
        $this->conn = null;
 
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}
?>