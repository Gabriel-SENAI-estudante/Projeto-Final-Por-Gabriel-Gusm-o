/* Cabum - interatividade (DOM) sem recarregar a página */
(function () {
    'use strict';

    // ---------- armazenamento seguro ----------
    function ler(chave, padrao) {
        try { var v = localStorage.getItem(chave); return v === null ? padrao : v; } catch (e) { return padrao; }
    }
    function gravar(chave, valor) { try { localStorage.setItem(chave, valor); } catch (e) { /* ignora */ } }
    function remover(chave) { try { localStorage.removeItem(chave); } catch (e) { /* ignora */ } }

    var brl = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };

    // ---------- 1. Tema claro/escuro ----------
    var raiz = document.documentElement;
    var botaoTema = document.getElementById('tema-toggle');
    function aplicarTema(tema) {
        if (tema === 'escuro') raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
        if (botaoTema) {
            botaoTema.setAttribute('aria-pressed', tema === 'escuro' ? 'true' : 'false');
            botaoTema.textContent = tema === 'escuro' ? 'Modo claro' : 'Modo escuro';
        }
    }
    aplicarTema(ler('cabum-tema', '') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
    if (botaoTema) botaoTema.addEventListener('click', function () {
        var novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
        gravar('cabum-tema', novo);
        aplicarTema(novo);
    });

    // ---------- 2. Menu responsivo ----------
    var botaoMenu = document.getElementById('menu-toggle');
    var menu = document.getElementById('menu');
    if (botaoMenu && menu) botaoMenu.addEventListener('click', function () {
        var aberto = menu.classList.toggle('aberto');
        botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    // ---------- 3. Carrinho (contador dinâmico) ----------
    var carrinho = {};
    try { carrinho = JSON.parse(ler('cabum-carrinho', '{}')) || {}; } catch (e) { carrinho = {}; }

    if (document.body.dataset.limparCarrinho) { carrinho = {}; remover('cabum-carrinho'); }

    function salvarCarrinho() { gravar('cabum-carrinho', JSON.stringify(carrinho)); }
    function totalItens() {
        return Object.keys(carrinho).reduce(function (s, id) { return s + carrinho[id]; }, 0);
    }
    function atualizarContador() {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = totalItens(); });
    }

    // Catálogo lido dos cartões da página (id, nome, preço)
    var catalogo = {};
    var cartoes = Array.prototype.slice.call(document.querySelectorAll('.cartao[data-id]'));
    cartoes.forEach(function (c) {
        catalogo[c.dataset.id] = { nome: c.dataset.nome, preco: parseFloat(c.dataset.preco) };
    });

    var lista = document.getElementById('carrinho-lista');
    var totalEl = document.getElementById('carrinho-total');
    var campoJson = document.getElementById('carrinho-json');

    function renderCarrinho() {
        atualizarContador();
        if (!lista) return;
        var ids = Object.keys(carrinho).filter(function (id) { return catalogo[id]; });
        lista.innerHTML = '';
        var total = 0;
        if (!ids.length) {
            var vazio = document.createElement('li');
            vazio.className = 'vazio';
            vazio.textContent = 'Seu carrinho está vazio. Escolha produtos no catálogo acima.';
            lista.appendChild(vazio);
        }
        ids.forEach(function (id) {
            var item = catalogo[id], qtd = carrinho[id];
            total += item.preco * qtd;
            var li = document.createElement('li');
            var nome = document.createElement('span');
            nome.textContent = item.nome;
            var sub = document.createElement('strong');
            sub.textContent = brl(item.preco * qtd);
            var ctrl = document.createElement('span');
            ctrl.className = 'qtd';
            [['-', -1, 'Diminuir'], ['+', 1, 'Aumentar']].forEach(function (b, i) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = b[0];
                btn.setAttribute('aria-label', b[2] + ' quantidade de ' + item.nome);
                btn.addEventListener('click', function () { alterar(id, b[1]); });
                ctrl.appendChild(btn);
                if (i === 0) { var n = document.createElement('span'); n.textContent = qtd; ctrl.appendChild(n); }
            });
            li.appendChild(nome); li.appendChild(sub); li.appendChild(ctrl);
            lista.appendChild(li);
        });
        if (totalEl) totalEl.textContent = brl(total);
        if (campoJson) campoJson.value = JSON.stringify(carrinho);
    }

    function alterar(id, delta) {
        carrinho[id] = Math.max(0, Math.min(99, (carrinho[id] || 0) + delta));
        if (!carrinho[id]) delete carrinho[id];
        salvarCarrinho();
        renderCarrinho();
    }

    cartoes.forEach(function (c) {
        var btn = c.querySelector('.add-carrinho');
        if (!btn) return;
        btn.addEventListener('click', function () {
            alterar(c.dataset.id, 1);
            var original = btn.textContent;
            btn.textContent = 'Adicionado!';
            setTimeout(function () { btn.textContent = original; }, 1000);
        });
    });
    renderCarrinho();

    // ---------- 4. Busca, filtro e ordenação em tempo real ----------
    var busca = document.getElementById('busca');
    var ordem = document.getElementById('ordem');
    var status = document.getElementById('status-busca');
    var grade = document.getElementById('grade-produtos');
    var botoesCat = document.querySelectorAll('.chip[data-cat]');
    var categoria = 'todas';

    function semAcento(t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

    function filtrar() {
        var termo = busca ? semAcento(busca.value.trim()) : '';
        var visiveis = 0;
        cartoes.forEach(function (c) {
            var texto = semAcento(c.dataset.nome + ' ' + c.dataset.cat);
            var ok = (categoria === 'todas' || c.dataset.cat === categoria) && texto.indexOf(termo) !== -1;
            c.hidden = !ok;
            if (ok) visiveis++;
        });
        if (grade && ordem) {
            var v = ordem.value;
            cartoes.slice().sort(function (a, b) {
                if (v === 'menor') return a.dataset.preco - b.dataset.preco;
                if (v === 'maior') return b.dataset.preco - a.dataset.preco;
                return a.dataset.nome.localeCompare(b.dataset.nome, 'pt-BR');
            }).forEach(function (c) { grade.appendChild(c); });
        }
        if (status) status.textContent = visiveis
            ? visiveis + (visiveis === 1 ? ' produto encontrado' : ' produtos encontrados')
            : 'Nenhum produto encontrado. Tente outro termo ou limpe o filtro.';
    }
    if (busca) busca.addEventListener('input', filtrar);
    if (ordem) ordem.addEventListener('change', filtrar);
    botoesCat.forEach(function (b) {
        b.addEventListener('click', function () {
            categoria = b.dataset.cat;
            botoesCat.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
            filtrar();
        });
    });
    if (grade) filtrar();

    // ---------- 5. Validação interativa do formulário ----------
    var form = document.getElementById('form-pedido');
    if (form) {
        var regras = {
            nome: function (v) { return v.trim().length >= 3 && /^[A-Za-zÀ-ÿ' .-]+$/.test(v.trim()) ? '' : 'Informe seu nome completo (mínimo 3 letras, sem números).'; },
            email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.'; },
            telefone: function (v) { var d = v.replace(/\D/g, ''); return d.length === 10 || d.length === 11 ? '' : 'Informe o telefone com DDD, ex.: (75) 99999-9999.'; },
            mensagem: function (v) { return v.length <= 500 ? '' : 'A mensagem pode ter no máximo 500 caracteres.'; }
        };
        function validarCampo(campo) {
            var regra = regras[campo.name];
            if (!regra) return true;
            var msg = regra(campo.value);
            var alvo = document.getElementById('erro-' + campo.name);
            if (alvo) alvo.textContent = msg;
            campo.classList.toggle('invalido', !!msg);
            campo.classList.toggle('valido', !msg && campo.value.trim() !== '');
            campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
            return !msg;
        }
        var tel = form.elements.telefone;
        tel.addEventListener('input', function () {
            var d = tel.value.replace(/\D/g, '').slice(0, 11), f = d;
            if (d.length > 6) f = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length > 10 ? 7 : 6) + '-' + d.slice(d.length > 10 ? 7 : 6);
            else if (d.length > 2) f = '(' + d.slice(0, 2) + ') ' + d.slice(2);
            tel.value = f;
        });
        Array.prototype.forEach.call(form.elements, function (campo) {
            if (!regras[campo.name]) return;
            campo.addEventListener('blur', function () { validarCampo(campo); });
            campo.addEventListener('input', function () { if (campo.classList.contains('invalido')) validarCampo(campo); });
        });
        var msgArea = form.elements.mensagem, contador = document.getElementById('contador-msg');
        msgArea.addEventListener('input', function () { contador.textContent = msgArea.value.length + '/500'; });

        form.addEventListener('submit', function (e) {
            var primeiroErro = null;
            Array.prototype.forEach.call(form.elements, function (campo) {
                if (regras[campo.name] && !validarCampo(campo) && !primeiroErro) primeiroErro = campo;
            });
            var vazio = !Object.keys(carrinho).length && !msgArea.value.trim();
            var aviso = document.getElementById('erro-pedido');
            aviso.textContent = vazio ? 'Adicione ao menos um produto ao carrinho ou descreva o que você procura na mensagem.' : '';
            e.preventDefault();
            if (primeiroErro || vazio) {
                (primeiroErro || msgArea).focus();
                return;
            }
            // Versão GitHub Pages (sem PHP): guarda o pedido e abre a página de confirmação
            var itens = Object.keys(carrinho).filter(function (id) { return catalogo[id]; }).map(function (id) {
                return { nome: catalogo[id].nome, qtd: carrinho[id], preco: catalogo[id].preco };
            });
            var pedido = {
                nome: form.elements.nome.value.trim(),
                email: form.elements.email.value.trim(),
                telefone: form.elements.telefone.value.trim(),
                tipo: form.elements.tipo.value,
                mensagem: msgArea.value.trim(),
                itens: itens
            };
            try { sessionStorage.setItem('cabum-pedido', JSON.stringify(pedido)); } catch (err) { /* ignora */ }
            window.location.href = 'confirmacao.html';
        });
    }
})();
