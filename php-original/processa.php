<?php
require __DIR__ . '/includes/dados.php';
date_default_timezone_set('America/Bahia');

// Somente POST: acesso direto volta para o formulário
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: produtos.php#pedido');
    exit;
}

$nome     = trim($_POST['nome'] ?? '');
$email    = trim($_POST['email'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$tipo     = $_POST['tipo'] ?? '';
$mensagem = trim($_POST['mensagem'] ?? '');
$carrinho = json_decode($_POST['carrinho'] ?? '{}', true);
if (!is_array($carrinho)) { $carrinho = []; }

// Validação no servidor (não confia só no JavaScript)
$erros = [];
if (mb_strlen($nome) < 3 || !preg_match("/^[\p{L}' .-]+$/u", $nome)) { $erros[] = 'Nome inválido.'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $erros[] = 'E-mail inválido.'; }
$digitos = preg_replace('/\D/', '', $telefone);
if (strlen($digitos) < 10 || strlen($digitos) > 11) { $erros[] = 'Telefone inválido (informe o DDD).'; }
if (!in_array($tipo, ['Pedido de compra', 'Orçamento', 'Dúvida técnica'], true)) { $erros[] = 'Tipo de solicitação inválido.'; }
if (mb_strlen($mensagem) > 500) { $erros[] = 'A mensagem excede 500 caracteres.'; }

// Monta os itens usando os preços do servidor, nunca os do navegador
$itens = [];
$total = 0;
foreach ($produtos as $p) {
    $qtd = isset($carrinho[$p['id']]) ? (int) $carrinho[$p['id']] : 0;
    if ($qtd > 0) {
        $qtd = min($qtd, 99);
        $sub = $qtd * $p['preco'];
        $total += $sub;
        $itens[] = ['nome' => $p['nome'], 'qtd' => $qtd, 'preco' => $p['preco'], 'sub' => $sub];
    }
}
if (!$itens && $mensagem === '') { $erros[] = 'Adicione um produto ao carrinho ou escreva uma mensagem.'; }

$titulo = $erros ? 'Revise seus dados' : 'Solicitação recebida';
$pagina_atual = '';
$limpar_carrinho = !$erros;
if ($erros) { http_response_code(422); }
require __DIR__ . '/includes/cabecalho.php';
?>
<main class="conteudo">
<?php if ($erros): ?>
    <section class="painel confirmacao com-erro">
        <h1>Não foi possível enviar</h1>
        <p>Corrija os itens abaixo e tente novamente:</p>
        <ul>
            <?php foreach ($erros as $e): ?><li><?= esc($e) ?></li><?php endforeach; ?>
        </ul>
        <p><a class="botao" href="produtos.php#pedido">Voltar ao formulário</a></p>
    </section>
<?php else:
    $protocolo = 'CB-' . date('Ymd') . '-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
    $primeiro_nome = explode(' ', $nome)[0];
?>
    <section class="painel confirmacao">
        <h1>Obrigado, <?= esc($primeiro_nome) ?>! Recebemos sua solicitação.</h1>
        <p>Protocolo <strong><?= esc($protocolo) ?></strong> registrado em <?= date('d/m/Y') ?> às <?= date('H:i') ?>. Entraremos em contato pelo e-mail ou telefone informado.</p>

        <h2>Dados recebidos</h2>
        <dl class="dados">
            <dt>Nome</dt><dd><?= esc($nome) ?></dd>
            <dt>E-mail</dt><dd><?= esc($email) ?></dd>
            <dt>Telefone</dt><dd><?= esc($telefone) ?></dd>
            <dt>Solicitação</dt><dd><?= esc($tipo) ?></dd>
            <dt>Mensagem</dt><dd><?= $mensagem !== '' ? nl2br(esc($mensagem)) : '&mdash;' ?></dd>
        </dl>

        <?php if ($itens): ?>
            <h2>Itens do pedido</h2>
            <div class="tabela-wrap">
                <table>
                    <thead><tr><th>Produto</th><th class="num">Qtd.</th><th class="num">Unitário</th><th class="num">Subtotal</th></tr></thead>
                    <tbody>
                    <?php foreach ($itens as $i): ?>
                        <tr><td><?= esc($i['nome']) ?></td><td class="num"><?= $i['qtd'] ?></td><td class="num"><?= brl($i['preco']) ?></td><td class="num"><?= brl($i['sub']) ?></td></tr>
                    <?php endforeach; ?>
                    </tbody>
                    <tfoot><tr><th colspan="3">Total</th><th class="num"><?= brl($total) ?></th></tr></tfoot>
                </table>
            </div>
        <?php endif; ?>

        <p><a class="botao" href="produtos.php">Continuar comprando</a> <a class="botao secundario" href="index.html">Voltar ao início</a></p>
    </section>
<?php endif; ?>
</main>
<?php require __DIR__ . '/includes/rodape.php'; ?>
