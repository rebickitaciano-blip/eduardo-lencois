/* Eduardo Lençóis, versão 2.
   O arco e a faixa de ofertas são animação de CSS. Aqui ficam só as entradas
   e as setas do trilho de categorias. Sem script, a página continua inteira. */

(() => {
  'use strict';

  const parado = matchMedia('(prefers-reduced-motion: reduce)');
  const todos = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  /* ---------- entradas ---------- */

  const entradas = () => {
    const alvos = todos('.entra');
    if (!alvos.length) return;

    if (parado.matches) {
      alvos.forEach((el) => el.classList.add('chegou'));
      return;
    }

    const observador = new IntersectionObserver(
      (lista, obs) => {
        lista.forEach((entrada, i) => {
          if (!entrada.isIntersecting) return;
          entrada.target.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
          entrada.target.classList.add('chegou');
          obs.unobserve(entrada.target);
        });
      },
      { threshold: 0 },
    );

    alvos.forEach((el) => observador.observe(el));

    /* Nada pode ficar invisível esperando uma rolagem que talvez não venha:
       captura de página inteira, impressão, leitor de tela. */
    setTimeout(() => {
      alvos.forEach((el) => {
        observador.unobserve(el);
        el.classList.add('chegou');
      });
    }, 2500);
  };

  /* ---------- setas do trilho de categorias ---------- */

  const trilho = () => {
    const faixa = document.querySelector('[data-trilho]');
    if (!faixa) return;

    const passo = () => {
      const card = faixa.querySelector('.categoria');
      if (!card) return faixa.clientWidth * 0.8;
      const vao = parseFloat(getComputedStyle(faixa).gap) || 20;
      return card.getBoundingClientRect().width + vao;
    };

    const mover = (sentido) =>
      faixa.scrollBy({ left: passo() * sentido, behavior: parado.matches ? 'auto' : 'smooth' });

    document.querySelector('[data-trilho-voltar]')?.addEventListener('click', () => mover(-1));
    document.querySelector('[data-trilho-avancar]')?.addEventListener('click', () => mover(1));
  };

  /* ---------- menu do celular ---------- */

  const menuDoTelefone = () => {
    const botao = document.querySelector('[data-abre-menu]');
    const painel = document.getElementById('menu-painel');
    if (!botao || !painel) return;

    const mostrar = (aberto) => {
      painel.hidden = !aberto;
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    };

    botao.addEventListener('click', () => mostrar(painel.hidden));

    /* Escolher um destino fecha o menu: ninguém quer voltar e fechar na mão. */
    painel.addEventListener('click', (e) => {
      if (e.target.closest('a')) mostrar(false);
    });

    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !painel.hidden) {
        mostrar(false);
        botao.focus();
      }
    });

    /* Girar o telefone para a horizontal traz a barra de links de volta. */
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) mostrar(false);
    });
  };

  entradas();
  trilho();
  menuDoTelefone();
})();
