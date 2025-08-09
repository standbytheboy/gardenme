<?php
// Garante que a sessão seja iniciada em qualquer lugar que este serviço for usado.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(__DIR__) . '/models/Usuario.php';
require_once dirname(__DIR__) . '/Dao/UsuarioDAO.php';
use Garden\Models\Usuario;
use Garden\Dao\UsuarioDAO;

function isLoggedIn(): bool {
    return isset($_SESSION['user_token']);
}

function getLoggedUser(): ?Usuario {
    if (!isLoggedIn()) {
        return null;
    }
    
    if (isset($_SESSION['user_object'])) {
        return unserialize($_SESSION['user_object']);
    }

    $dao = new UsuarioDAO();
    $usuario = $dao->getByToken($_SESSION['user_token']);

    if ($usuario) {
        $_SESSION['user_object'] = serialize($usuario);
    }
    
    return $usuario;
}

function requireLogin(string $redirectUrl = '/sistema_vendas/pages/usuarios/login.php') {
    if (!isLoggedIn()) {
        $_SESSION['redirect_url'] = $_SERVER['REQUEST_URI'];
        header("Location: " . $redirectUrl);
        exit();
    }
}

function isAdmin(): bool {
    $user = getLoggedUser();
    return $user && $user->isAdmin();
}

function requireAdmin() {
    requireLogin();
    
    // Se o usuário está logado, mas não é admin, redireciona para a home.
    if (!isAdmin()) {
        // Armazena uma mensagem de erro na sessão para ser exibida na página inicial.
        $_SESSION['flash_message'] = [
            'type' => 'error',
            'message' => 'Acesso negado. Você não tem permissão para acessar esta página.'
        ];
        header('Location: ');
        exit();
    }
}