<?php


// Cabeçalhos essenciais para a API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// CORREÇÃO: Usando nosso autoloader manual que está na raiz do backend
require_once __DIR__ . '/../autoload.php';

// Importa o Controller que vamos usar
use Garden\Controllers\CategoriaController;

// --- Roteador ---

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// ATENÇÃO: Ajuste este caminho para o seu projeto
$basePath = '/gardenme/backend/public';

// Lida com a requisição pré-voo do CORS
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$route = str_replace($basePath, '', $path);
$controller = new CategoriaController();

// --- Rotas Específicas para Categorias ---

// Rota para /api/categorias/{id}
if (preg_match('#^/api/categorias/(\d+)$#', $route, $matches)) {
    $id = (int)$matches[1];
    if ($method === 'GET') $controller->detalhar($id);
    if ($method === 'PUT') $controller->atualizar($id);
    if ($method === 'DELETE') $controller->deletar($id);
    exit();
}

// Rota para /api/categorias
if ($route === '/api/categorias') {
    if ($method === 'GET') $controller->listar();
    if ($method === 'POST') $controller->criar();
    exit();
}

// Se nenhuma rota de categoria corresponder...
http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);