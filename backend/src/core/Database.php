<?php

namespace Garden\core;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    // ==================== Para Windows ====================
    
    // ==================== Para Linux ====================
    // private const DB_HOST = '127.0.0.1';
    // private const DB_NAME = 'gardenme';
    // private const DB_USER = 'gardenme';
    // private const DB_PASS = 'senha_forte';

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            try {
                $db_host = getenv('DB_HOST') ?: 'db';
                $db_name = getenv('DB_NAME') ?: 'gardenme';
                $db_user = getenv('DB_USER') ?: 'gardenme';
                $db_pass = getenv('DB_PASS') ?: 'senha_forte';

                $dsn = 'mysql:host=' . $db_host . ';port=3306;dbname=' . $db_name . ';charset=utf8mb4';

                self::$instance = new PDO($dsn, $db_user, $db_pass);

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
