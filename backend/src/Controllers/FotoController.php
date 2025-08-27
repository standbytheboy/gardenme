<?php

namespace Garden\Controllers;

use Garden\Dao\UsuarioDao;
use Garden\Middleware\AuthMiddleware; // Incluído para verificação do token

class FotoController
{
    private UsuarioDao $usuarioDao;
    private string $diretorioUploads;

    public function __construct()
    {
        $this->usuarioDao = new UsuarioDao();
        // O diretório de uploads deve ser acessível pelo servidor web
        $this->diretorioUploads = __DIR__ . '/../../public/uploads/profile_pictures/';
    }

    public function upload(int $id_usuario, object $dadosToken)
    {
        // 1. Verificação de permissão
        if ($id_usuario !== $dadosToken->data->id_usuario) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você só pode atualizar sua própria foto.']);
            exit;
        }

        // 2. Validação do arquivo
        if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nenhum arquivo enviado ou erro no upload.']);
            exit;
        }

        $file = $_FILES['profile_picture'];
        $extensao = pathinfo($file['name'], PATHINFO_EXTENSION);
        $extensoesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'];

        if (!in_array(strtolower($extensao), $extensoesPermitidas)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Formato de arquivo não suportado. Use JPG, PNG, GIF, AVIF ou WEBP.']);
            exit;
        }

        // 3. Gerar nome único e salvar o arquivo
        $novoNomeArquivo = uniqid('foto_') . '.' . $extensao;
        $caminhoCompleto = $this->diretorioUploads . $novoNomeArquivo;

        if (!move_uploaded_file($file['tmp_name'], $caminhoCompleto)) {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Falha ao mover o arquivo.']);
            exit;
        }

        // 4. Deletar a foto antiga, se existir
        $usuario = $this->usuarioDao->buscarPorId($id_usuario);
        if ($usuario && $usuario->getCaminhoFotoPerfil()) {
            $caminhoAntigo = $this->diretorioUploads . $usuario->getCaminhoFotoPerfil();
            if (file_exists($caminhoAntigo)) {
                unlink($caminhoAntigo);
            }
        }

        // 5. Atualizar o caminho no banco de dados
        $sucesso = $this->usuarioDao->atualizarCaminhoFotoPerfil($id_usuario, $novoNomeArquivo);

        if ($sucesso) {
            http_response_code(200);
            echo json_encode(['mensagem' => 'Foto de perfil atualizada com sucesso.', 'caminho' => $novoNomeArquivo]);
        } else {
            // Se a atualização no banco falhar, exclua o arquivo recém-enviado
            if (file_exists($caminhoCompleto)) {
                unlink($caminhoCompleto);
            }
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao salvar o caminho da foto no banco de dados.']);
        }
    }

    public function deletar(int $id_usuario, object $dadosToken)
    {
        // 1. Verificação de permissão
        if ($id_usuario !== $dadosToken->data->id_usuario) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você só pode deletar sua própria foto.']);
            exit;
        }

        // 2. Obter e excluir o arquivo
        $usuario = $this->usuarioDao->buscarPorId($id_usuario);

        if ($usuario && $usuario->getCaminhoFotoPerfil()) {
            $caminhoFoto = $this->diretorioUploads . $usuario->getCaminhoFotoPerfil();
            if (file_exists($caminhoFoto)) {
                unlink($caminhoFoto);
            }

            // 3. Remover o caminho do banco de dados
            $sucesso = $this->usuarioDao->removerCaminhoFotoPerfil($id_usuario);

            if ($sucesso) {
                http_response_code(200);
                echo json_encode(['mensagem' => 'Foto de perfil excluída com sucesso.']);
            } else {
                http_response_code(500);
                echo json_encode(['mensagem' => 'Erro interno ao remover o caminho da foto do banco de dados.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Nenhuma foto de perfil encontrada para excluir.']);
        }
    }
}