/* Cabum - página de confirmação (substitui processa.php no GitHub Pages) */
(function () {
    'use strict';
    var area = document.querySelector('#confirmacao .painel');
    if (!area) return;
    var brl = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
    var pedido = null;
    try { pedido = JSON.parse(sessionStorage.getItem('cabum-pedido')); } catch (e) { pedido = null; }

    function el(tag, texto, classe) {
        var n = document.createElement(tag);
        if (texto !== undefined) n.textContent = texto;
        if (classe) n.className = classe;
        return n;
    }
    function link(texto, href, classe) {
        var a = el('a', texto, classe); a.href = href; return a;
    }
    area.innerHTML = '';

    if (!pedido) {
        area.classList.add('com-erro');
        area.appendChild(el('h1', 'Nenhuma solicitação encontrada'));
        area.appendChild(el('p', 'Preencha o formulário de pedido para gerar uma confirmação.'));
        area.appendChild(link('Ir para o formulário', 'produtos.html#pedido', 'botao'));
        return;
    }

    var agora = new Date();
    var d = agora.toLocaleDateString('pt-BR');
    var h = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    var ymd = agora.getFullYear() + String(agora.getMonth() + 1).padStart(2, '0') + String(agora.getDate()).padStart(2, '0');
    var protocolo = 'CB-' + ymd + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    area.appendChild(el('h1', 'Obrigado, ' + pedido.nome.split(' ')[0] + '! Recebemos sua solicitação.'));
    var p = el('p', 'Protocolo ');
    p.appendChild(el('strong', protocolo));
    p.appendChild(document.createTextNode(' registrado em ' + d + ' às ' + h + '. Entraremos em contato pelo e-mail ou telefone informado.'));
    area.appendChild(p);

    area.appendChild(el('h2', 'Dados recebidos'));
    var dl = el('dl', undefined, 'dados');
    [['Nome', pedido.nome], ['E-mail', pedido.email], ['Telefone', pedido.telefone],
     ['Solicitação', pedido.tipo], ['Mensagem', pedido.mensagem || '—']].forEach(function (par) {
        dl.appendChild(el('dt', par[0])); dl.appendChild(el('dd', par[1]));
    });
    area.appendChild(dl);

    if (pedido.itens && pedido.itens.length) {
        area.appendChild(el('h2', 'Itens do pedido'));
        var wrap = el('div', undefined, 'tabela-wrap');
        var t = document.createElement('table');
        var thead = document.createElement('thead'), tr = document.createElement('tr');
        ['Produto', 'Qtd.', 'Unitário', 'Subtotal'].forEach(function (c, i) { tr.appendChild(el('th', c, i ? 'num' : '')); });
        thead.appendChild(tr); t.appendChild(thead);
        var tbody = document.createElement('tbody'), total = 0;
        pedido.itens.forEach(function (i) {
            var sub = i.qtd * i.preco; total += sub;
            var r = document.createElement('tr');
            r.appendChild(el('td', i.nome));
            r.appendChild(el('td', String(i.qtd), 'num'));
            r.appendChild(el('td', brl(i.preco), 'num'));
            r.appendChild(el('td', brl(sub), 'num'));
            tbody.appendChild(r);
        });
        t.appendChild(tbody);
        var tfoot = document.createElement('tfoot'), rf = document.createElement('tr');
        var th = el('th', 'Total'); th.colSpan = 3; rf.appendChild(th);
        rf.appendChild(el('th', brl(total), 'num'));
        tfoot.appendChild(rf); t.appendChild(tfoot);
        wrap.appendChild(t); area.appendChild(wrap);
    }

    var acoes = el('p');
    acoes.appendChild(link('Continuar comprando', 'produtos.html', 'botao'));
    acoes.appendChild(document.createTextNode(' '));
    acoes.appendChild(link('Voltar ao início', 'index.html', 'botao secundario'));
    area.appendChild(acoes);
    try { sessionStorage.removeItem('cabum-pedido'); } catch (e) { /* ignora */ }
})();
