<?php
require __DIR__ . '/../vendor/autoload.php';

use Garden\Models\Usuario;

$usuario = new Usuario(nome: 'Teste', sobrenome: 'Usuario', email: 'teste@teste.com');
var_dump($usuario);
