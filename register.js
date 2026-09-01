/* Registration flow: four steps, three payment paths, one POST.
   No framework; the server does the real validation again. */
(function () {
  var form = document.getElementById('regForm');
  if (!form) return;
  var steps = Array.prototype.slice.call(form.querySelectorAll('.reg-step'));
  var dots = Array.prototype.slice.call(form.querySelectorAll('[data-step-dot]'));
  var back = form.querySelector('.reg-back');
  var next = form.querySelector('.reg-next');
  var errEl = form.querySelector('.reg-error');
  var current = 0;

  function show(i) {
    current = i;
    steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    dots.forEach(function (d, k) {
      d.classList.toggle('is-on', k === i);
      d.classList.toggle('is-done', k < i);
    });
    back.hidden = i === 0;
    next.textContent = i < steps.length - 1 ? 'Continue' : payLabel();
    errEl.hidden = true;
    var first = steps[i].querySelector('input, select, textarea');
    if (first) first.focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function payLabel() {
    var v = form.payment_method.value;
    return v === 'card' ? 'Continue to payment'
         : v === 'etransfer' ? 'Reserve his spot'
         : 'Send request';
  }
  Array.prototype.forEach.call(form.querySelectorAll('input[name=payment_method]'), function (r) {
    r.addEventListener('change', function () { next.textContent = payLabel(); });
  });

  function validStep(i) {
    var fields = steps[i].querySelectorAll('input, select, textarea');
    for (var k = 0; k < fields.length; k++) {
      if (!fields[k].checkValidity()) { fields[k].reportValidity(); return false; }
    }
    return true;
  }

  back.addEventListener('click', function () { show(current - 1); });

  next.addEventListener('click', function () {
    if (!validStep(current)) return;
    if (current < steps.length - 1) { show(current + 1); return; }
    submit();
  });

  function fail(msg) {
    errEl.textContent = msg;
    errEl.hidden = false;
    next.disabled = false;
    next.textContent = payLabel();
  }

  function submit() {
    next.disabled = true;
    next.textContent = 'One moment';
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.consent_waiver = form.consent_waiver.checked;
    data.photo_consent = form.photo_consent.checked;
    data.waiver_version = 'v2026-1';

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) return fail(res.j.error || 'Something went wrong. Email info@ymaw.com and we will register him by hand.');
        if (res.j.url) { location.href = res.j.url; return; }
        var q = '?path=' + encodeURIComponent(res.j.fallback || data.payment_method) +
                '&ref=' + encodeURIComponent(res.j.ref || '') +
                '&son=' + encodeURIComponent(data.son_first || '') +
                (res.j.demo ? '&demo=1' : '');
        location.href = '/success.html' + q;
      })
      .catch(function () { fail('Could not reach the server. Check your connection and try again, or email info@ymaw.com.'); });
  }

  show(0);

  /* Cancelled Stripe checkout returns here. */
  if (new URLSearchParams(location.search).get('canceled')) {
    errEl.textContent = 'Checkout was cancelled. Nothing was charged; his details are saved and you can pay any time.';
    errEl.hidden = false;
    show(3);
  }
})();

/* Production-team mini form. */
(function () {
  var f = document.getElementById('teamForm');
  if (!f) return;
  var err = f.querySelector('.reg-error');
  var done = f.querySelector('.reg-mini__done');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = f.querySelector('button');
    btn.disabled = true;
    var data = {};
    new FormData(f).forEach(function (v, k) { data[k] = v; });
    fetch('/api/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error();
      f.reset(); done.hidden = false; err.hidden = true; btn.disabled = false;
    }).catch(function () {
      err.textContent = 'Could not send just now. Email info@ymaw.com instead.';
      err.hidden = false; btn.disabled = false;
    });
  });
})();
