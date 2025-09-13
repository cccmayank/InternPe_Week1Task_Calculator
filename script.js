(function(){
  const historyEl = document.getElementById('history');
  const currentEl = document.getElementById('current');
  const keys = document.getElementById('keys');

  let expr = '';

  function updateDisplay(){
    historyEl.textContent = expr || '\u00A0';
    currentEl.textContent = (expr === '' ? '0' : expr);
  }

  function safeEvaluate(s) {
    s = s.replace(/×/g, '*').replace(/÷/g, '/');
    s = s.replace(/([+\-*/%]){2,}/g, (m) => m[m.length-1]);
    if (!/^[0-9+\-*/().% ]+$/.test(s)) {
      throw new Error('Invalid characters');
    }
    s = s.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    const result = Function('"use strict"; return (' + s + ')')();
    if (!isFinite(result)) throw new Error('Math error');
    return result;
  }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');

    if (action === 'clear') {
      expr = '';
      updateDisplay();
      return;
    }
    if (action === 'back') {
      expr = expr.slice(0, -1);
      updateDisplay();
      return;
    }
    if (action === 'percent') {
      expr += '%';
      updateDisplay();
      return;
    }
    if (action === 'equals') {
      evaluateAndShow();
      return;
    }

    if (val) {
      if (val === '.') {
        const lastNumberMatch = expr.match(/(\d+(\.\d+)?)$/);
        if (lastNumberMatch && lastNumberMatch[0].includes('.')) return;
        if (!lastNumberMatch) expr += '0';
      }
      expr += val;
      updateDisplay();
    }
  });

  function evaluateAndShow() {
    try {
      if (expr.trim() === '') return;
      const res = safeEvaluate(expr);
      expr = String(res);
      updateDisplay();
    } catch (err) {
      currentEl.textContent = 'Error';
      console.error(err);
    }
  }

  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+','-','*','/','.','%','(',')'].includes(e.key)) {
      expr += e.key;
      updateDisplay();
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' || e.key === '=') {
      evaluateAndShow();
      e.preventDefault();
      return;
    }
    if (e.key === 'Backspace') {
      expr = expr.slice(0, -1);
      updateDisplay();
      e.preventDefault();
      return;
    }
    if (e.key === 'Escape') {
      expr = '';
      updateDisplay();
      e.preventDefault();
      return;
    }
  });

  updateDisplay();
})();
