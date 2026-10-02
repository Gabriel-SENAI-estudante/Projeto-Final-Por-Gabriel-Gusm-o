<?php
// Catálogo único usado por produtos.php e processa.php
// (valores fictícios, apenas para demonstração do protótipo)
$produtos = [
    ['id' => 'cpu-6n',  'nome' => 'Processador 6 núcleos 3,7 GHz',   'cat' => 'CPU',          'preco' => 1199.90, 'img' => 'CPU.webp',        'pagina' => 'Pagina_CPU.html',         'desc' => 'Ótimo custo-benefício para trabalho e jogos em Full HD.'],
    ['id' => 'cpu-8n',  'nome' => 'Processador 8 núcleos 4,2 GHz',   'cat' => 'CPU',          'preco' => 1899.90, 'img' => 'CPU.webp',        'pagina' => 'Pagina_CPU.html',         'desc' => 'Mais desempenho para edição de vídeo e multitarefa.'],
    ['id' => 'mb-b650', 'nome' => 'Placa-mãe ATX DDR5',              'cat' => 'Placa-mãe',    'preco' => 1249.90, 'img' => 'Placa_Mae.webp',  'pagina' => 'Pagina_Placa_Mae.html',   'desc' => 'Quatro slots de memória, Wi-Fi e suporte a SSD NVMe.'],
    ['id' => 'mb-mini', 'nome' => 'Placa-mãe Micro-ATX DDR4',        'cat' => 'Placa-mãe',    'preco' => 599.90,  'img' => 'Placa_Mae.webp',  'pagina' => 'Pagina_Placa_Mae.html',   'desc' => 'Compacta e econômica para montar um PC de escritório.'],
    ['id' => 'ram-16',  'nome' => 'Memória RAM 16 GB DDR4 3200 MHz', 'cat' => 'Memória RAM', 'preco' => 289.90,  'img' => 'Memoria_Ram.png', 'pagina' => 'Pagina_Memoria_Ram.html', 'desc' => 'Pente único de 16 GB com dissipador de alumínio.'],
    ['id' => 'ram-32',  'nome' => 'Kit RAM 32 GB (2x16) DDR5',       'cat' => 'Memória RAM', 'preco' => 749.90,  'img' => 'Memoria_Ram.png', 'pagina' => 'Pagina_Memoria_Ram.html', 'desc' => 'Kit dual channel de alta frequência para PCs modernos.'],
    ['id' => 'gpu-8',   'nome' => 'Placa de vídeo 8 GB GDDR6',       'cat' => 'GPU',          'preco' => 2299.90, 'img' => 'GPU.png',         'pagina' => 'Pagina_GPU.html',         'desc' => 'Jogos em Full HD e QHD com ótima eficiência.'],
    ['id' => 'gpu-16',  'nome' => 'Placa de vídeo 16 GB GDDR6',      'cat' => 'GPU',          'preco' => 4199.90, 'img' => 'GPU.png',         'pagina' => 'Pagina_GPU.html',         'desc' => 'Para jogos em 4K, renderização 3D e inteligência artificial.'],
];

function esc($texto) { return htmlspecialchars((string) $texto, ENT_QUOTES, 'UTF-8'); }
function brl($valor) { return 'R$ ' . number_format($valor, 2, ',', '.'); }
