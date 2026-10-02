# Cabum – Loja de tecnologia (Projeto Final SENAI – CQPG)

Protótipo de loja de hardware feito com HTML, CSS, JavaScript (DOM) e PHP.
Autor: Gabriel Gusmão.

## Estrutura

```
/                  → versão estática, publicada no GitHub Pages
├── index.html
├── produtos.html          (catálogo + carrinho + formulário)
├── confirmacao.html       (substitui o processa.php no GitHub Pages)
├── Pagina_CPU.html, Pagina_Placa_Mae.html, Pagina_Memoria_Ram.html, Pagina_GPU.html
├── css/  js/  img/
└── php-original/          → versão com PHP (entrega ao SENAI / rodar com XAMPP)
    ├── produtos.php, processa.php
    └── includes/ (cabecalho.php, rodape.php, dados.php)
```

## Como publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex.: `projeto-final-cabum`).
2. Envie **o conteúdo desta pasta** (não o .zip) para a raiz do repositório.
3. Em **Settings → Pages**, em *Build and deployment*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Observações

- O GitHub Pages **não executa PHP**. Por isso a raiz usa `produtos.html` e `confirmacao.html`; a validação e a confirmação do pedido rodam em JavaScript (nenhum dado é enviado a servidor).
- A versão com PHP (validação no servidor, preços do servidor) está em `php-original/`. Para testar localmente: `php -S localhost:8000 -t php-original`.
- Os nomes de arquivos diferenciam maiúsculas e minúsculas no GitHub (`Pagina_CPU.html` ≠ `pagina_cpu.html`).
