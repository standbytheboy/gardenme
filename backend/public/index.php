<?php
// Local: backend/public/index.php

// Cabeçalhos essenciais para a API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite que qualquer frontend acesse
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Carrega nosso autoloader manual para encontrar as classes
require_once __DIR__ . '/../autoload.php';

// Importa os Controllers que vamos usar
use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController; // Vamos adicionar as rotas dele em breve

// --- Início do Roteador ---

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// ATENÇÃO: Ajuste este caminho base para corresponder à sua estrutura de pastas no XAMPP
// Se o seu projeto está em C:\xampp\htdocs\gardenme, o caminho está correto.
$basePath = '/gardenme/backend/public'; 

// O roteador lida com a requisição pré-voo do CORS (método OPTIONS)
if ($method === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

// Remove o caminho base da URL da requisição para ter uma rota limpa
$route = str_replace($basePath, '', $path);


// --- Rotas de Autenticação ---
if ($route === '/api/registrar' && $method === 'POST') {
    (new AuthController())->registrar();
    exit();
}

if ($route === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
    exit();
}


// --- Rotas de Categoria ---
if (preg_match('#^/api/categorias/(\d+)$#', $route, $matches)) {
    $id = (int)$matches[1];
    $controller = new CategoriaController();
    
    if ($method === 'GET') $controller->detalhar($id);
    if ($method === 'PUT') $controller->atualizar($id);
    if ($method === 'DELETE') $controller->deletar($id);
    exit();
}

if ($route === '/api/categorias' && $method === 'GET') {
    (new CategoriaController())->listar();
    exit();
}

if ($route === '/api/categorias' && $method === 'POST') {
    (new CategoriaController())->criar();
    exit();
}


// --- Fim das Rotas ---


// Se nenhuma rota corresponder, retorna erro 404
http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);