<?php
require __DIR__ . '/includes/dados.php';
$titulo = 'Produtos';
$pagina_atual = 'produtos';
$categorias = array_values(array_unique(array_column($produtos, 'cat')));
require __DIR__ . '/includes/cabecalho.php';
?>
<main class="conteudo">
    <section class="secao" aria-labelledby="titulo-catalogo">
        <h1 id="titulo-catalogo">Catálogo de hardware</h1>
        <p>Busque, filtre por categoria e monte seu pedido. O carrinho é atualizado na hora, sem recarregar a página.</p>

        <div class="ferramentas">
            <div>
                <label for="busca">Buscar produto</label>
                <input type="text" id="busca" placeholder="Ex.: DDR5, 16 GB, processador" autocomplete="off">
            </div>
            <div>
                <label for="ordem">Ordenar por</label>
                <select id="ordem">
                    <option value="nome">Nome (A–Z)</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                </select>
            </div>
            <div class="filtros" role="group" aria-label="Filtrar por categoria">
                <button type="button" class="chip" data-cat="todas" aria-pressed="true">Todas</button>
                <?php foreach ($categorias as $cat): ?>
                    <button type="button" class="chip" data-cat="<?= esc($cat) ?>" aria-pressed="false"><?= esc($cat) ?></button>
                <?php endforeach; ?>
            </div>
        </div>
        <p class="status" id="status-busca" role="status" aria-live="polite"></p>

        <div class="grade" id="grade-produtos">
            <?php foreach ($produtos as $p): ?>
                <article class="cartao" data-id="<?= esc($p['id']) ?>" data-nome="<?= esc($p['nome']) ?>" data-cat="<?= esc($p['cat']) ?>" data-preco="<?= esc($p['preco']) ?>">
                    <img src="img/<?= esc($p['img']) ?>" alt="<?= esc($p['cat']) ?>" width="200" height="200" loading="lazy">
                    <span class="categoria"><?= esc($p['cat']) ?></span>
                    <h3><?= esc($p['nome']) ?></h3>
                    <p class="descricao"><?= esc($p['desc']) ?></p>
                    <span class="preco"><?= brl($p['preco']) ?></span>
                    <div class="acoes">
                        <button type="button" class="botao add-carrinho">Adicionar</button>
                        <a class="detalhe" href="<?= esc($p['pagina']) ?>">Saiba mais</a>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

    <section class="secao" id="pedido" aria-labelledby="titulo-pedido">
        <h2 id="titulo-pedido">Solicitar pedido ou orçamento</h2>
        <div class="pedido">
            <div class="painel">
                <h3>Seu carrinho</h3>
                <ul class="carrinho-lista" id="carrinho-lista" aria-live="polite"></ul>
                <p class="total"><span>Total</span> <span id="carrinho-total">R$ 0,00</span></p>
            </div>

            <form class="painel" id="form-pedido" action="processa.php" method="post" novalidate>
                <h3>Seus dados</h3>
                <input type="hidden" name="carrinho" id="carrinho-json" value="{}">
                <div class="campo">
                    <label for="nome">Nome completo</label>
                    <input type="text" id="nome" name="nome" required autocomplete="name" aria-describedby="erro-nome">
                    <p class="erro-campo" id="erro-nome"></p>
                </div>
                <div class="campo">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" required autocomplete="email" aria-describedby="erro-email">
                    <p class="erro-campo" id="erro-email"></p>
                </div>
                <div class="campo">
                    <label for="telefone">Telefone com DDD</label>
                    <input type="tel" id="telefone" name="telefone" required autocomplete="tel" inputmode="numeric" placeholder="(75) 99999-9999" aria-describedby="erro-telefone">
                    <p class="erro-campo" id="erro-telefone"></p>
                </div>
                <div class="campo">
                    <label for="tipo">Tipo de solicitação</label>
                    <select id="tipo" name="tipo">
                        <option value="Pedido de compra">Pedido de compra</option>
                        <option value="Orçamento">Orçamento</option>
                        <option value="Dúvida técnica">Dúvida técnica</option>
                    </select>
                </div>
                <div class="campo">
                    <label for="mensagem">Mensagem (opcional)</label>
                    <textarea id="mensagem" name="mensagem" rows="4" maxlength="500" aria-describedby="erro-mensagem"></textarea>
                    <span class="ajuda" id="contador-msg">0/500</span>
                    <p class="erro-campo" id="erro-mensagem"></p>
                </div>
                <p class="erro-campo" id="erro-pedido" role="alert"></p>
                <button type="submit" class="botao">Enviar solicitação</button>
            </form>
        </div>
    </section>
</main>
<?php require __DIR__ . '/includes/rodape.php'; ?>
