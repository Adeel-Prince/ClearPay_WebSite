/* Contact form: accessible client-side validation.
   - messages appear next to each field and are linked with aria-describedby
   - an error summary receives focus on a failed submit
   - no data is sent anywhere (this is a demo): success is simulated */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var summary = document.getElementById("error-summary");
  var summaryList = document.getElementById("error-summary-list");
  var success = document.getElementById("form-success");
  var submitBtn = document.getElementById("submit-btn");
  var message = document.getElementById("message");
  var counter = document.getElementById("message-count");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) {
      return v.trim().length < 2
        ? "Enter your full name (at least 2 characters)."
        : "";
    },
    email: function (v) {
      return !v.trim()
        ? "Enter your email address."
        : !EMAIL.test(v.trim())
          ? "Enter a valid email address, like name@example.com."
          : "";
    },
    topic: function (v) {
      return !v ? "Choose what your message is about." : "";
    },
    message: function (v) {
      var n = v.trim().length;
      return n < 20 ? "Write at least 20 characters (you have " + n + ")." : "";
    },
    consent: function (v, el) {
      return !el.checked ? "Please agree before sending your message." : "";
    },
  };
  var labels = {
    name: "Full name",
    email: "Email address",
    topic: "Topic",
    message: "Message",
    consent: "Consent",
  };

  function check(id) {
    var el = document.getElementById(id);
    var err = document.getElementById(id + "-error");
    var msg = rules[id](el.value, el);
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      el.setAttribute("aria-invalid", "true");
      el.classList.add("is-invalid");
    } else {
      err.hidden = true;
      err.textContent = "";
      el.removeAttribute("aria-invalid");
      el.classList.remove("is-invalid");
    }
    return msg;
  }

  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("blur", function () {
      check(id);
    });
    el.addEventListener(
      el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input",
      function () {
        if (el.getAttribute("aria-invalid") === "true") check(id); // re-check live once the user is fixing it
      },
    );
  });

  message.addEventListener("input", function () {
    counter.textContent = message.value.length + " / " + message.maxLength;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var problems = [];
    Object.keys(rules).forEach(function (id) {
      var msg = check(id);
      if (msg) problems.push({ id: id, msg: msg });
    });

    if (problems.length) {
      summaryList.innerHTML = "";
      problems.forEach(function (p) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + p.id;
        a.textContent = labels[p.id] + ": " + p.msg;
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          document.getElementById(p.id).focus();
        });
        li.appendChild(a);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setTimeout(function () {
      // simulated network request
      form.hidden = true;
      success.hidden = false;
      success.focus();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }, 900);
  });

  document
    .getElementById("send-another")
    .addEventListener("click", function () {
      form.reset();
      counter.textContent = "0 / " + message.maxLength;
      success.hidden = true;
      form.hidden = false;
      document.getElementById("name").focus();
    });
})();
