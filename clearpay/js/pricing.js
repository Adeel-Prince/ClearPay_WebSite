/* Real-time pricing calculator.
   Monthly cost = subscription + (volume x rate) + (transactions x fixed fee) + add-ons */
(function () {
  "use strict";
  var form = document.getElementById("calculator");
  if (!form) return;

  var PLANS = {
    starter: { name: "Starter", monthly: 0, rate: 0.029, fixed: 0.3 },
    growth: { name: "Growth", monthly: 49, rate: 0.025, fixed: 0.25 },
    scale: { name: "Scale", monthly: 199, rate: 0.02, fixed: 0.2 },
  };
  var COMPETITOR = { rate: 0.034, fixed: 0.3, intl: 0.015, instant: 0.01 }; // typical processor, for comparison
  var INTL_FEE = 0.01; // ClearPay: +1% on the international share
  var INSTANT_FEE = 0.005; // ClearPay: +0.5% for instant payouts
  var ANNUAL_DISCOUNT = 0.2; // 20% off subscriptions when billed annually

  var $ = function (id) {
    return document.getElementById(id);
  };
  var volRange = $("volume-range"),
    volNumber = $("volume-number"),
    ticket = $("ticket"),
    intl = $("intl"),
    instant = $("instant");
  var money0 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  var money2 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  var liveTimer = null;

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function read() {
    var min = parseFloat(volRange.min),
      max = parseFloat(volRange.max);
    var vol = parseFloat(volNumber.value);
    if (isNaN(vol)) vol = min;
    return {
      volume: clamp(vol, min, max),
      ticket: parseFloat(ticket.value),
      intlShare: parseFloat(intl.value) / 100,
      instant: instant.checked,
      annual: form.elements.billing.value === "annual",
    };
  }

  function planCost(plan, s) {
    var tx = s.volume / s.ticket;
    var sub = plan.monthly * (s.annual ? 1 - ANNUAL_DISCOUNT : 1);
    var processing = s.volume * plan.rate + tx * plan.fixed;
    var addons =
      s.volume * s.intlShare * INTL_FEE +
      (s.instant ? s.volume * INSTANT_FEE : 0);
    return sub + processing + addons;
  }
  function competitorCost(s) {
    var tx = s.volume / s.ticket;
    return (
      s.volume * COMPETITOR.rate +
      tx * COMPETITOR.fixed +
      s.volume * s.intlShare * COMPETITOR.intl +
      (s.instant ? s.volume * COMPETITOR.instant : 0)
    );
  }

  function update() {
    var s = read();
    // sync control labels
    $("volume-label").textContent = money0.format(s.volume) + " / month";
    $("ticket-label").textContent = money0.format(s.ticket);
    $("intl-label").textContent = Math.round(s.intlShare * 100) + "%";
    ticket.setAttribute(
      "aria-valuetext",
      money0.format(s.ticket) + " per transaction",
    );
    intl.setAttribute(
      "aria-valuetext",
      Math.round(s.intlShare * 100) + " percent international",
    );
    volRange.setAttribute(
      "aria-valuetext",
      money0.format(s.volume) + " per month",
    );
    var tx = Math.round(s.volume / s.ticket);
    $("tx-count").textContent = tx.toLocaleString("en-US");

    // cost per plan
    var best = null,
      bestCost = Infinity,
      costs = {};
    Object.keys(PLANS).forEach(function (key) {
      var c = planCost(PLANS[key], s);
      costs[key] = c;
      if (c < bestCost) {
        bestCost = c;
        best = key;
      }
    });
    Object.keys(PLANS).forEach(function (key) {
      var el = document.querySelector('[data-plan="' + key + '"]');
      el.querySelector("[data-cost]").textContent = money0.format(costs[key]);
      el.querySelector("[data-effective]").textContent =
        ((costs[key] / s.volume) * 100).toFixed(2) + "%";
      el.querySelector("[data-sub]").textContent = money0.format(
        PLANS[key].monthly * (s.annual ? 1 - ANNUAL_DISCOUNT : 1),
      );
      el.classList.toggle("is-best", key === best);
    });

    var comp = competitorCost(s);
    var saveMonth = Math.max(0, comp - bestCost);
    $("result-total").textContent = money0.format(bestCost);
    $("result-plan").textContent = PLANS[best].name;
    $("result-effective").textContent =
      ((bestCost / s.volume) * 100).toFixed(2) + "%";
    $("result-competitor").textContent = money0.format(comp);
    $("result-save-month").textContent = money0.format(saveMonth);
    $("result-save-year").textContent = money0.format(saveMonth * 12);

    // screen-reader summary: updated after the user pauses, so dragging a slider is not noisy
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      $("summary").textContent =
        "Recommended plan: " +
        PLANS[best].name +
        ", about " +
        money0.format(bestCost) +
        " per month, saving " +
        money0.format(saveMonth) +
        " per month compared with a typical processor.";
    }, 600);
  }

  // keep slider and number box in sync
  volRange.addEventListener("input", function () {
    volNumber.value = volRange.value;
    update();
  });
  volNumber.addEventListener("input", function () {
    var v = parseFloat(volNumber.value);
    if (!isNaN(v))
      volRange.value = clamp(
        v,
        parseFloat(volRange.min),
        parseFloat(volRange.max),
      );
    update();
  });
  volNumber.addEventListener("change", function () {
    // tidy up on blur / enter
    var s = read();
    volNumber.value = s.volume;
    volRange.value = s.volume;
    update();
  });
  [ticket, intl, instant].forEach(function (el) {
    el.addEventListener("input", update);
  });
  Array.prototype.forEach.call(form.elements.billing, function (el) {
    el.addEventListener("change", update);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  update();
})();
