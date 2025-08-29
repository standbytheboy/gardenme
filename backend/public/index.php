<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/../vendor/autoload.php';

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
} catch (\Dotenv\Exception\InvalidPathException $e) {
    try {
        $dotenv = Dotenv\Dotenv::createImmutable('C:/xampp/htdocs/gardenme/backend/');
        $dotenv->load();
    } catch (\Exception $ex) {
        die("Erro crítico: não foi possível carregar o arquivo .env. Verifique o caminho e as permissões. Erro: " . $ex->getMessage());
    }
}

use Garden\Middleware\AuthMiddleware;
use Garden\Controllers\AuthController;
use Garden\Controllers\CategoriaController;
use Garden\Controllers\DicasController;
use Garden\Controllers\EnderecoController;
use Garden\Controllers\FotoController;
use Garden\Controllers\OrdemDePedidoController; 
use Garden\Controllers\ProdutoController;
use Garden\Controllers\UsuarioController;

// **Movido para o topo para que fiquem disponíveis para todas as rotas**
// define('DB_HOST', 'localhost');
// define('DB_PASSWORD', '');
// define('DB_USER', 'root');
// define('DB_NAME', 'gardenme');

function sendResponse($status, $message, $data = []) {
    http_response_code($status);
    echo json_encode(['message' => $message, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];

    $basePath = '/gardenme/backend/public';
    $route = str_replace($basePath, '', $path);
    $controller = null;
    $dadosToken = null;

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

    // Roteamento que exige autenticação
    $requiresAuth = [
        '#^/api/dicas$#' => ['POST'],
        '#^/api/dicas/(\d+)$#' => ['PUT', 'DELETE'],
        '#^/api/usuarios/(\d+)/enderecos$#' => ['GET', 'POST'],
        '#^/api/enderecos/(\d+)$#' => ['PUT', 'DELETE'],
        '#^/api/usuarios/(\d+)$#' => ['GET', 'PUT', 'DELETE'],
        '#^/api/categorias/(\d+)$#' => ['DELETE'],
        '#^/api/usuarios/(\d+)/foto$#' => ['POST', 'DELETE'],
        '#^/api/meus-pedidos$#' => ['GET'],
        '#^/api/pedidos$#' => ['POST'],
        '#^/api/meus-dicas$#' => ['GET'],
    ];

    foreach ($requiresAuth as $pattern => $methods) {
        if (preg_match($pattern, $route, $matches) && in_array($method, $methods)) {
            $authResult = AuthMiddleware::verificar();
            if (is_array($authResult) && isset($authResult['status'])) {
                http_response_code($authResult['status']);
                echo json_encode(['mensagem' => $authResult['mensagem']]);
                exit();
            }
            $dadosToken = $authResult;
            break; 
        }
    }

    if ($route === '/api/pedidos' && $method === 'POST' && $dadosToken) {
        (new OrdemDePedidoController())->criar($dadosToken);
        exit();
    }

    if ($route === '/api/meus-pedidos' && $method === 'GET' && $dadosToken) {
        $pedidos = (new OrdemDePedidoController())->listarPedidosComDetalhes($dadosToken);
        echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);
        exit();
    }

     if ($route === '/api/minhas-dicas' && $method === 'GET' && $dadosToken) {
        (new OrdemDePedidoController())->listarDicasDoUsuario($dadosToken);
        exit();
    }

    if (preg_match('#^/api/categorias(/(\d+))?$#', $route, $matches)) {
        $id = $matches[2] ?? null;
        $controller = new CategoriaController();
        if ($id) {
            if ($method === 'GET') $controller->detalhar($id);
            if ($method === 'PUT') $controller->atualizar($id);
            if ($method === 'DELETE' && $dadosToken) $controller->deletar($id);
        } else {
            if ($method === 'GET') $controller->listar();
            if ($method === 'POST') $controller->criar();
        }
        exit();
    }

    if (preg_match('#^/api/dicas(/(\d+))?$#', $route, $matches)) {
        $id = $matches[2] ?? null;
        $controller = new DicasController();
        if ($id) {
            if ($method === 'GET') $controller->detalhar($id);
            if ($method === 'PUT' && $dadosToken) $controller->atualizar($id);
            if ($method === 'DELETE' && $dadosToken) $controller->deletar($id);
        } else {
            if ($method === 'GET') $controller->listar();
            if ($method === 'POST' && $dadosToken) $controller->criar();
        }
        exit();
    }

    if (preg_match('#^/api/usuarios/(\d+)/enderecos$#', $route, $matches)) {
        $id_usuario = (int)$matches[1];
        $controller = new EnderecoController();
        if ($method === 'GET' && $dadosToken) {
            $controller->listarPorUsuario($id_usuario, $dadosToken);
        }
        if ($method === 'POST' && $dadosToken) {
            $controller->criar($id_usuario, $dadosToken);
        }
        exit();
    }

    if (preg_match('#^/api/enderecos/(\d+)$#', $route, $matches)) {
        $id_endereco = (int)$matches[1];
        $controller = new EnderecoController();
        if ($method === 'PUT' && $dadosToken) {
            $controller->atualizar($id_endereco, $dadosToken);
        }
        if ($method === 'DELETE' && $dadosToken) {
            $controller->deletar($id_endereco, $dadosToken);
        }
        exit();
    }

    if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
        $id = (int)$matches[1];
        $controller = new UsuarioController();
        if ($method === 'GET' && $dadosToken) $controller->buscar($id, $dadosToken);
        if ($method === 'PUT' && $dadosToken) $controller->atualizar($id, $dadosToken);
        if ($method === 'DELETE' && $dadosToken) $controller->deletar($id, $dadosToken);
        exit();
    }

    if (preg_match('#^/api/usuarios/(\d+)/foto$#', $route, $matches)) {
        $id_usuario = (int)$matches[1];
        $controller = new FotoController();
        if ($method === 'POST' && $dadosToken) {
            $controller->upload($id_usuario, $dadosToken);
        }
        if ($method === 'DELETE' && $dadosToken) {
            $controller->deletar($id_usuario, $dadosToken);
        }
        exit();
    }

    if (preg_match('#^/api/produtos/primeiro$#', $route)) {
        if ($method === 'GET') {
            $controller = new ProdutoController();
            $controller->buscarPrimeiro();
        } else {
            http_response_code(405); // Method Not Allowed
            echo json_encode(['mensagem' => 'Método não permitido para esta rota.']);
        }
        exit(); 

    } elseif (preg_match('#^/api/produtos(/(\d+))?$#', $route, $matches)) {
        $id = $matches[2] ?? null;
        $controller = new ProdutoController();

        // Rotas que exigem ser administrador
        if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
            $authResult = AuthMiddleware::verificar();
            if (isset($authResult->status)) {
                http_response_code($authResult->status);
                echo json_encode(['mensagem' => $authResult->mensagem]);
                exit();
            }
            
            $usuarioDao = new \Garden\Dao\UsuarioDao();
            $usuario = $usuarioDao->buscarPorId($authResult->data->id_usuario);
            
            if (!$usuario || !$usuario->isAdmin()) {
                http_response_code(403); // Forbidden
                echo json_encode(['mensagem' => 'Acesso negado. Apenas administradores podem executar esta ação.']);
                exit();
            }
        }

        // Direciona para o método correto do controller
        if ($id) {
            // Rotas com ID: /api/produtos/123
            switch ($method) {
                case 'GET':
                    $controller->detalhar((int)$id);
                    break;
                case 'PUT':
                    $controller->atualizar((int)$id);
                    break;
                case 'DELETE':
                    $controller->deletar((int)$id);
                    break;
                default:
                    http_response_code(405); // Method Not Allowed
                    echo json_encode(['mensagem' => 'Método não permitido para esta rota.']);
                    break;
            }
        } else {
            // Rotas sem ID: /api/produtos
            switch ($method) {
                case 'GET':
                    $controller->listar();
                    break;
                case 'POST':
                    $controller->criar();
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['mensagem' => 'Método não permitido para esta rota.']);
                    break;
            }
        }
        exit();
    }

    http_response_code(404);
    echo json_encode(['mensagem' => 'Endpoint não encontrado']);
    exit();

} catch (\Throwable $e) { 
    http_response_code(500); // Internal Server Error

    // Loga o erro real no log do servidor para poder depurar
    error_log("Erro fatal não capturado no roteador: " . $e->getMessage() . " em " . $e->getFile() . " na linha " . $e->getLine());
    error_log("Stack trace: " . $e->getTraceAsString());

    // Envia uma resposta JSON genérica para o frontend
    echo json_encode(['mensagem' => 'Ocorreu um erro crítico no servidor.']);
    exit();
}