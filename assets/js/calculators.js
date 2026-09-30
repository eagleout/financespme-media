
function euro(n){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0)}
function num(id){return parseFloat((document.getElementById(id)?.value||'0').replace(',','.'))||0}
function calcBfr(){const v=num('stocks')+num('clients')-num('fournisseurs');document.getElementById('bfr-result').textContent=euro(v)}
function calcDscr(){const cf=num('cashflow'), debt=num('debtservice');const v=debt?cf/debt:0;document.getElementById('dscr-result').textContent=(v||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+'x'}
function calcLoan(){const p=num('principal'), annual=num('rate')/100, n=num('months');const r=annual/12;const m=n?(r? p*r/(1-Math.pow(1+r,-n)):p/n):0;document.getElementById('loan-result').textContent=euro(m)}
document.addEventListener('input',e=>{if(e.target.closest('[data-calc="bfr"]'))calcBfr();if(e.target.closest('[data-calc="dscr"]'))calcDscr();if(e.target.closest('[data-calc="loan"]'))calcLoan();});
document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('bfr-result'))calcBfr();if(document.getElementById('dscr-result'))calcDscr();if(document.getElementById('loan-result'))calcLoan();});
