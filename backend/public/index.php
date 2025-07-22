<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Garden\Middleware\AuthMiddleware;
use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController;
use Garden\Controllers\DicasController;
use Garden\Controllers\EnderecoController; // Adicionamos o novo Controller

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$basePath = '/gardenme/backend/public'; 

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$route = str_replace($basePath, '', $path);
$controller = null; 

// --- Rotas de Autenticação ---
if ($route === '/api/registrar' && $method === 'POST') {
    (new AuthController())->registrar();
    exit();
}
if ($route === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
    exit();
}
if ($route === '/api/logout' && $method === 'POST') {
    AuthMiddleware::verificar();
    (new AuthController())->logout();
    exit();
}

// --- Rotas de Categorias ---
if (preg_match('#^/api/categorias(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new CategoriaController();
    
    if ($id) {
        if ($method === 'GET') $controller->detalhar($id);
        if ($method === 'PUT') $controller->atualizar($id);
        if ($method === 'DELETE') $controller->deletar($id);
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST') $controller->criar();
    }
    exit();
}

// --- Rotas de Dicas e Cuidados ---
if (preg_match('#^/api/dicas(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new DicasController();

    if ($id) { 
        if ($method === 'GET') $controller->detalhar($id);

        if ($method === 'PUT') {
            AuthMiddleware::verificar(); 
            $controller->atualizar($id);
        }
        if ($method === 'DELETE') {
            AuthMiddleware::verificar();
            $controller->deletar($id);
        }
    } else { 
        if ($method === 'GET') $controller->listar();
        
        if ($method === 'POST') {
            AuthMiddleware::verificar(); 
            $controller->criar();
        }
    }
    exit();
}

// ---- INÍCIO DAS ROTAS DE ENDEREÇO ----

// Rota para LISTAR e CRIAR endereços (baseado no id do usuário)
if (preg_match('#^/api/usuarios/(\d+)/enderecos$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar();
    $id_usuario = (int)$matches[1];
    $controller = new EnderecoController();

    if ($method === 'GET') {
        $controller->listarPorUsuario($id_usuario, $dadosToken);
    }
    if ($method === 'POST') {
        $controller->criar($id_usuario, $dadosToken);
    }
    exit();
}

// Rota para ATUALIZAR e DELETAR um endereço específico (baseado no id do endereço)
if (preg_match('#^/api/enderecos/(\d+)$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar();
    $id_endereco = (int)$matches[1];
    $controller = new EnderecoController();

    if ($method === 'PUT') {
        $controller->atualizar($id_endereco, $dadosToken);
    }
    if ($method === 'DELETE') {
        $controller->deletar($id_endereco, $dadosToken);
    }
    exit();
}

// ---- FIM DAS ROTAS DE ENDEREÇO ----

// --- Rotas de Usuários (Protegidas) ---
if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar(); 
    $id = (int)$matches[1];
    $controller = new UsuarioController();

    if ($method === 'GET') $controller->buscar($id, $dadosToken);
    if ($method === 'PUT') $controller->atualizar($id, $dadosToken);
    if ($method === 'DELETE') $controller->deletar($id, $dadosToken);
    
    exit();
}

// Se nenhuma rota foi encontrada
http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);