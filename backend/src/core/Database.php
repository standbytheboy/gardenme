<?php

namespace Garden\Core;
use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    private const DB_HOST = 'localhost';
    private const DB_NAME = 'gardenme';
    private const DB_USER = 'root';
    private const DB_PASS = '';


    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            try {
                $dsn = 'mysql:host=' . self::DB_HOST . ';dbname=' . self::DB_NAME . ';charset=utf8';
                
                self::$instance = new PDO($dsn, self::DB_USER, self::DB_PASS);
                
                
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                self::$instance->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            } catch (PDOException $e) {
                throw $e;
            }
        }
        
        return self::$instance;
    }
}