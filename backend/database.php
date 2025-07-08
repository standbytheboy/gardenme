<?php

class Database {
    public static function getInstance()
    {
        $db_dbhost = "localhost";
        $db_name = "gardenme";
        $db_user = "root";
        $db_pass = "";

        try {
            $pdo = new PDO("mysql:host={$db_dbhost};dbname={$db_name};", $db_user, $db_pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch (PDOException $e) {
            // Em produção, gravar isso em um LOG
            die("Erro de conexão com o banco". $e->getMessage());
        }
    }
}
$db = Database::getInstance();