<?php

namespace Garden\Controllers;

use Garden\DAO\UsuarioDAO;

class UsuarioController
{
    public function buscar(int $id, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        if ($idUsuarioLogado !== $id) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você só pode acessar seus próprios dados.']);
            return;
        }

        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($id);
        header('Content-Type: application/json');
        if ($usuario) {
            $resultado = [
                'id' => $usuario->getId(),
                'nome' => $usuario->getNome(),
                'sobrenome' => $usuario->getSobrenome(),
                'email' => $usuario->getEmail(),
                'celular' => $usuario->getCelular(),
                'caminho_foto_perfil' => $usuario->getCaminhoFotoPerfil()
            ];
            echo json_encode($resultado);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Usuário não encontrado.']);
        }
    }

       public function atualizar(int $id, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        if ($idUsuarioLogado !== $id) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você só pode acessar seus próprios dados.']);
            return;
        }

        $dadosCorpo = json_decode(file_get_contents('php://input'), true);

        if (empty($dadosCorpo)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nenhum dado fornecido para atualização.']);
            return;
        }

        $usuarioDAO = new UsuarioDAO();
        $usuarioExistente = $usuarioDAO->buscarPorId($id);

        if (!$usuarioExistente) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Usuário não encontrado.']);
            return;
        }
        
        // Lógica de alteração de senha
        if (isset($dadosCorpo['senhaAtual'], $dadosCorpo['novaSenha'])) {
            // Busca a senha hash do usuário no banco de dados para verificação
            $usuarioComSenha = $usuarioDAO->buscarPorEmail($usuarioExistente->getEmail());

            if (!password_verify($dadosCorpo['senhaAtual'], $usuarioComSenha['senha_hash'])) {
                http_response_code(401);
                echo json_encode(['mensagem' => 'A senha atual está incorreta.']);
                return;
            }
            
            // Criptografa a nova senha e adiciona aos dados para atualização
            $dadosCorpo['senha'] = $dadosCorpo['novaSenha'];
            unset($dadosCorpo['senhaAtual']);
            unset($dadosCorpo['novaSenha']);
        }

        // Se o email for atualizado, verifica se já existe
        if (isset($dadosCorpo['email'])) {
             $usuarioComEmailExistente = $usuarioDAO->buscarPorEmail($dadosCorpo['email']);
             if ($usuarioComEmailExistente && (int)$usuarioComEmailExistente['id_usuario'] !== (int)$id) {
                 http_response_code(409);
                 echo json_encode(['mensagem' => 'O e-mail fornecido já está em uso.']);
                 return;
             }
        }
        
        $resultado = $usuarioDAO->atualizar($id, $dadosCorpo);

        header('Content-Type: application/json');

        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao atualizar: o e-mail fornecido já está em uso.']);
        } elseif ($resultado) {
            echo json_encode(['mensagem' => 'Usuário atualizado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao tentar atualizar o usuário.']);
        }
    }

    public function deletar(int $id, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        if ($idUsuarioLogado !== $id) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você só pode acessar seus próprios dados.']);
            return;
        }

        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($id);

        if (!$usuario) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Usuário não encontrado.']);
            return;
        }

        $sucesso = $usuarioDAO->deletar($id);

        header('Content-Type: application/json');
        if ($sucesso) {
            echo json_encode(['mensagem' => 'Usuário deletado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar usuário ou usuário não encontrado.']);
        }
    }
}
