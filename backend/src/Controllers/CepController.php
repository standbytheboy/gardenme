<?php

namespace Garden\Controllers;

class CepController
{
    public function buscar(string $cep)
    {
        // Limpa o CEP para conter apenas números
        $cepLimpo = preg_replace('/[^0-9]/', '', $cep);

        if (strlen($cepLimpo) !== 8) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'CEP inválido.']);
            return;
        }

        // URL da API externa
        $url = "https://showcommerce.com.br/api/cep/{$cepLimpo}";

        // Usando cURL para uma chamada mais robusta
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Timeout de 10 segundos
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $httpCode >= 400) {
            http_response_code(502); // Bad Gateway
            echo json_encode(['mensagem' => 'Não foi possível conectar ao serviço de CEP.']);
            return;
        }
        
        // Repassa os cabeçalhos e o corpo da resposta para o seu frontend
        header('Content-Type: application/json');
        http_response_code($httpCode);
        echo $response;
    }
}
