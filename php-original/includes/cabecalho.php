<?php
// Uso: $titulo e $pagina_atual ('inicio' | 'produtos') definidos antes do include
$pagina_atual = $pagina_atual ?? '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/gif" href="img/Icone_Do_Site.gif">
    <link rel="stylesheet" href="css/style.css">
    <title><?= esc($titulo) ?> | Cabum</title>
    <script>try{var t=localStorage.getItem('cabum-tema');if(t)document.documentElement.dataset.tema=t;}catch(e){}</script>
</head>
<body<?= !empty($limpar_carrinho) ? ' data-limpar-carrinho="1"' : '' ?>>
<header class="topo">
    <a class="marca" href="index.html"><img src="img/Icone_Do_Site.gif" alt="" width="48" height="48"><span>Cabum</span></a>
    <button class="botao-icone menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav class="menu" id="menu" aria-label="Navegação principal">
        <a href="index.html"<?= $pagina_atual === 'inicio' ? ' aria-current="page"' : '' ?>>Início</a>
        <a href="produtos.php"<?= $pagina_atual === 'produtos' ? ' aria-current="page"' : '' ?>>Produtos</a>
        <a href="produtos.php#pedido">Fazer pedido</a>
    </nav>
    <button class="botao-icone" id="tema-toggle" aria-pressed="false">Modo escuro</button>
    <a class="botao-icone carrinho-btn" href="produtos.php#pedido">Carrinho<b data-cart-count>0</b></a>
</header>
