SELECT * FROM gardenme.status;

use gardenme;

insert status (descricao, criado_em, atualizado_em) values 
	("Aguardando confirmação do pedido", now(), now()),
    ("Aguardando confirmação de pagamento", now(), now()),
	("Pedido realizado com sucesso", now(), now()),
    ("Pedido Cancelado", now(), now());