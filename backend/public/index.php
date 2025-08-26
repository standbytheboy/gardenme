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
use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController;
use Garden\Controllers\DicasController;
use Garden\Controllers\EnderecoController;
use Garden\Controllers\FotoController;
use Garden\Controllers\ProdutoController;
use Garden\Controllers\OrdemDePedidoController;

// **Movido para o topo para que fiquem disponíveis para todas as rotas**
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'gardenme');

function sendResponse($status, $message, $data = []) {
    http_response_code($status);
    echo json_encode(['message' => $message, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

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

if (preg_match('#^/api/produtos(/(\d+))?$#', $route, $matches)) {
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
        
        // Carrega o usuário para verificar se é admin
        $usuarioDAO = new \Garden\DAO\UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($authResult->data->id_usuario);
        
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

// **lógica de pedido integrada ao roteador**
if ($route === '/api/pedidos' && $method === 'POST') {
    $authResult = AuthMiddleware::verificar();
    if (is_array($authResult) && isset($authResult['status'])) {
        http_response_code($authResult['status']);
        echo json_encode(['mensagem' => $authResult['mensagem']]);
        exit();
    }
    $dadosToken = $authResult;

    // Recebe e decodifica o payload JSON
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        sendResponse(400, 'Erro ao decodificar JSON: ' . json_last_error_msg());
    }

    // lógica de criação do pedido
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO ordem_de_pedido (id_usuario, id_endereco, id_status, preco_total, valor_frete, pagamento_metodo, pagamento_status) 
            VALUES (:id_usuario, :id_endereco, :id_status, :preco_total, :valor_frete, :pagamento_metodo, :pagamento_status)
        ");

        $stmt->bindParam(':id_usuario', $data['id_usuario']);
        $stmt->bindParam(':id_endereco', $data['id_endereco']);
        $stmt->bindParam(':id_status', $data['id_status']);
        $stmt->bindParam(':preco_total', $data['preco_total']);
        $stmt->bindParam(':valor_frete', $data['valor_frete']);
        $stmt->bindParam(':pagamento_metodo', $data['pagamento_metodo']);
        $stmt->bindParam(':pagamento_status', $data['pagamento_status']);
        $stmt->execute();
        
        $id_pedido = $pdo->lastInsertId();

        $stmt_items = $pdo->prepare("
            INSERT INTO itens_do_pedido (id_pedido, id_produto, quantidade, preco_unitario) 
            VALUES (:id_pedido, :id_produto, :quantidade, :preco_unitario)
        ");

        foreach ($data['itens'] as $item) {
            $stmt_items->bindParam(':id_pedido', $id_pedido);
            $stmt_items->bindParam(':id_produto', $item['id_produto']);
            $stmt_items->bindParam(':quantidade', $item['quantidade']);
            $stmt_items->bindParam(':preco_unitario', $item['preco_unitario']);
            $stmt_items->execute();
        }

        $pdo->commit();
        sendResponse(201, 'Pedido criado com sucesso.', ['id_pedido' => $id_pedido]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendResponse(500, 'Erro ao criar o pedido: ' . $e->getMessage());
    }
    exit();

}

// Roteamento específico para a listagem de pedidos após a autenticação
if ($route === '/api/meus-pedidos' && $method === 'GET' && $dadosToken) {
    $controller = new Garden\Controllers\OrdemDePedidoController();
    $pedidos = $controller->listarPedidosComDetalhes($dadosToken);
    header('Content-Type: application/json');
    echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);
    exit();
}

http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);
exit();