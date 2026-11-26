/* ==========================================================================
   MISSI INNOVATION — INTEGRATED BOOKING SYSTEM (/, /en, /mg)
   - Native <dialog> with showModal(), Esc & light-dismiss fallback
   - Visitor timezone detection + EAT (UTC+3) / CET conversion preview
   - Supabase REST insert (anon INSERT-only via RLS) + instant WhatsApp CTA
   ========================================================================== */
(function () {
  'use strict';

  const SLOT_EAT_HOURS = {
    '09:00-11:00': { startH: 9, endH: 11, labelFr: 'Matin (09h–11h EAT)', labelEn: 'Morning (09:00–11:00 EAT)' },
    '11:00-13:00': { startH: 11, endH: 13, labelFr: 'Fin de matinée (11h–13h EAT)', labelEn: 'Late Morning (11:00–13:00 EAT)' },
    '14:00-16:00': { startH: 14, endH: 16, labelFr: 'Après-midi (14h–16h EAT)', labelEn: 'Afternoon (14:00–16:00 EAT)' },
    '16:00-18:00': { startH: 16, endH: 18, labelFr: 'Fin de journée (16h–18h EAT)', labelEn: 'Late Afternoon (16:00–18:00 EAT)' }
  };

  function getParisOffsetHours(dateStr) {
    try {
      const refDate = dateStr ? new Date(dateStr + 'T12:00:00Z') : new Date();
      const parisStr = refDate.toLocaleString('en-US', { timeZone: 'Europe/Paris', hour12: false, hour: '2-digit' });
      const utcStr = refDate.toLocaleString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit' });
      let diff = parseInt(parisStr, 10) - parseInt(utcStr, 10);
      if (diff < 0) diff += 24;
      return diff;
    } catch (_) {
      return 1;
    }
  }

  function formatHourRange(startEat, endEat, offsetFromEat) {
    const pad = (n) => String((n + 24) % 24).padStart(2, '0');
    return `${pad(startEat + offsetFromEat)}h–${pad(endEat + offsetFromEat)}h`;
  }

  function getVisitorTz() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC+3';
    } catch (_) {
      return 'UTC+3';
    }
  }

  function getVisitorOffsetFromEat(dateStr) {
    try {
      const refDate = dateStr ? new Date(dateStr + 'T12:00:00Z') : new Date();
      // getTimezoneOffset is minutes behind UTC (e.g. -180 for UTC+3, -60 for UTC+1)
      const visitorUtcOffsetHours = -refDate.getTimezoneOffset() / 60;
      return Math.round(visitorUtcOffsetHours - 3);
    } catch (_) {
      return 0;
    }
  }

  function initBookingModal() {
    const dialog = document.getElementById('booking-dialog');
    if (!(dialog instanceof HTMLDialogElement)) return;

    const market = dialog.getAttribute('data-market') || 'intl-fr';
    const isEn = market === 'intl-en';

    // Light-dismiss fallback for browsers without closedby="any"
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e)) dialog.close();
      });
    }

    const form = document.getElementById('booking-form');
    const formView = document.getElementById('booking-form-view');
    const successView = document.getElementById('booking-success-view');
    const dateInput = document.getElementById('bk-date');
    const slotSelect = document.getElementById('bk-slot');
    const tzPreview = document.getElementById('bk-tz-preview');
    const errBox = document.getElementById('bk-error');
    const submitBtn = document.getElementById('bk-submit');

    // Default date = tomorrow
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date(Date.now() + 86400000);
      const iso = tomorrow.toISOString().split('T')[0];
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.value = iso;
    }

    function updateTzPreview() {
      if (!tzPreview || !slotSelect) return;
      const slot = SLOT_EAT_HOURS[slotSelect.value] || SLOT_EAT_HOURS['09:00-11:00'];
      const dateVal = dateInput ? dateInput.value : '';
      const tzName = getVisitorTz();
      const parisOffsetFromEat = getParisOffsetHours(dateVal) - 3;
      const visitorOffsetFromEat = getVisitorOffsetFromEat(dateVal);

      const eatRange = formatHourRange(slot.startH, slot.endH, 0);
      const parisRange = formatHourRange(slot.startH, slot.endH, parisOffsetFromEat);
      const localRange = formatHourRange(slot.startH, slot.endH, visitorOffsetFromEat);

      if (isEn) {
        tzPreview.innerHTML =
          `Detected timezone: <strong>${tzName}</strong> (${localRange} your local time) &bull; ` +
          `Madagascar: <strong>${eatRange} EAT</strong> &bull; Europe (Paris): <strong>${parisRange}</strong>`;
      } else {
        tzPreview.innerHTML =
          `Fuseau détecté : <strong>${tzName}</strong> (${localRange} heure locale) &bull; ` +
          `Madagascar : <strong>${eatRange} EAT</strong> &bull; Europe (Paris) : <strong>${parisRange}</strong>`;
      }
    }

    if (slotSelect) slotSelect.addEventListener('change', updateTzPreview);
    if (dateInput) dateInput.addEventListener('change', updateTzPreview);
    updateTzPreview();

    // Open triggers
    document.querySelectorAll('[data-open-booking]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const presetPole = trigger.getAttribute('data-pole');
        const poleSelect = document.getElementById('bk-pole');
        if (presetPole && poleSelect) {
          for (const opt of poleSelect.options) {
            if (opt.value === presetPole) {
              poleSelect.value = presetPole;
              break;
            }
          }
        }
        if (formView && successView) {
          formView.hidden = false;
          successView.hidden = true;
        }
        if (errBox) errBox.hidden = true;
        updateTzPreview();
        dialog.showModal();
      });
    });

    const closeBtn = document.getElementById('bk-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    const newBookingBtn = document.getElementById('bk-new');
    if (newBookingBtn && formView && successView) {
      newBookingBtn.addEventListener('click', () => {
        successView.hidden = true;
        formView.hidden = false;
        if (form) form.reset();
        updateTzPreview();
      });
    }

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errBox) errBox.hidden = true;

      // Honeypot check
      const hp = document.getElementById('bk-hp');
      if (hp && hp.value.trim() !== '') {
        dialog.close();
        return;
      }

      const fullName = (document.getElementById('bk-name')?.value || '').trim();
      const org = (document.getElementById('bk-org')?.value || '').trim();
      const whatsapp = (document.getElementById('bk-whatsapp')?.value || '').trim();
      const email = (document.getElementById('bk-email')?.value || '').trim();
      const pole = (document.getElementById('bk-pole')?.value || '').trim();
      const prefDate = (dateInput?.value || '').trim();
      const prefSlot = (slotSelect?.value || '').trim();
      const message = (document.getElementById('bk-msg')?.value || '').trim();

      if (!fullName || (!whatsapp && !email) || !pole || !prefDate || !prefSlot) {
        if (errBox) {
          errBox.textContent = isEn
            ? 'Please enter your name, a WhatsApp number or email, and a preferred date/slot.'
            : 'Merci de renseigner votre nom, un numéro WhatsApp ou email, ainsi que la date et le créneau.';
          errBox.hidden = false;
        }
        if (!fullName) document.getElementById('bk-name')?.focus();
        else if (!whatsapp && !email) document.getElementById('bk-whatsapp')?.focus();
        return;
      }

      const visitorTz = getVisitorTz();
      const payload = {
        market,
        lang: isEn ? 'en' : 'fr',
        full_name: fullName,
        organization: org || null,
        whatsapp: whatsapp || null,
        email: email || null,
        service_pole: pole,
        preferred_date: prefDate,
        preferred_slot: prefSlot,
        visitor_timezone: visitorTz,
        message: message || null,
        status: 'Nouveau'
      };

      const cfg = window.MISSI_CONFIG || {};
      const origLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isEn ? 'Saving request...' : 'Enregistrement...';
      }

      let dbSaved = false;
      if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
        try {
          const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/${cfg.BOOKINGS_TABLE || 'bookings'}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: cfg.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY}`,
              Prefer: 'return=minimal'
            },
            body: JSON.stringify(payload)
          });
          dbSaved = res.ok;
        } catch (_) {
          dbSaved = false;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origLabel;
      }

      // Show confirmation + pre-filled WhatsApp CTA
      const recapEl = document.getElementById('bk-recap');
      const waBtn = document.getElementById('bk-wa-confirm');
      const dbNotice = document.getElementById('bk-db-notice');

      if (recapEl) {
        recapEl.innerHTML = isEn
          ? `<strong>Name:</strong> ${escapeHtml(fullName)}${org ? ` (${escapeHtml(org)})` : ''}<br>` +
            `<strong>Practice:</strong> ${escapeHtml(pole)}<br>` +
            `<strong>Date &amp; Slot:</strong> ${escapeHtml(prefDate)} &bull; ${escapeHtml(prefSlot)} EAT (${escapeHtml(visitorTz)})` +
            `${whatsapp ? `<br><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}` : ''}` +
            `${email ? `<br><strong>Email:</strong> ${escapeHtml(email)}` : ''}`
          : `<strong>Contact :</strong> ${escapeHtml(fullName)}${org ? ` (${escapeHtml(org)})` : ''}<br>` +
            `<strong>Besoin :</strong> ${escapeHtml(pole)}<br>` +
            `<strong>Date &amp; Créneau :</strong> ${escapeHtml(prefDate)} &bull; ${escapeHtml(prefSlot)} EAT (${escapeHtml(visitorTz)})` +
            `${whatsapp ? `<br><strong>WhatsApp :</strong> ${escapeHtml(whatsapp)}` : ''}` +
            `${email ? `<br><strong>Email :</strong> ${escapeHtml(email)}` : ''}`;
      }

      if (dbNotice) {
        if (dbSaved) {
          dbNotice.textContent = isEn
            ? 'Your request has been recorded. Click below to also open WhatsApp for instant confirmation.'
            : 'Votre demande est bien enregistrée. Cliquez ci-dessous pour confirmer instantanément sur WhatsApp.';
        } else {
          dbNotice.textContent = isEn
            ? 'Your summary is ready. Click below to send your booking directly via WhatsApp.'
            : 'Votre récapitulatif est prêt. Cliquez ci-dessous pour envoyer directement votre réservation sur WhatsApp.';
        }
      }

      if (waBtn) {
        const waNum = cfg.WHATSAPP_NUMBER || '261347151789';
        const waMsg = isEn
          ? `Hello Missi Engineering, I just booked a 20-min call:\n- Name: ${fullName}${org ? ` (${org})` : ''}\n- Need: ${pole}\n- Preferred slot: ${prefDate} (${prefSlot} EAT / ${visitorTz})${message ? `\n- Note: ${message}` : ''}`
          : `Bonjour Missi Innovation, je viens de planifier un échange de 20 min :\n- Nom : ${fullName}${org ? ` (${org})` : ''}\n- Besoin : ${pole}\n- Créneau souhaité : ${prefDate} (${prefSlot} EAT / ${visitorTz})${message ? `\n- Précision : ${message}` : ''}`;
        waBtn.href = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
      }

      if (formView && successView) {
        formView.hidden = true;
        successView.hidden = false;
      }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  document.addEventListener('DOMContentLoaded', initBookingModal);
})();
