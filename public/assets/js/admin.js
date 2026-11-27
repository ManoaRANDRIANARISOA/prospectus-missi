(function () {
  'use strict';

  const FIREBASE_SDK_BASE = 'https://www.gstatic.com/firebasejs/11.6.1';
  const cfg = window.MISSI_CONFIG || {};
  let fb = null;
  let allRows = [];

  async function initFirebase() {
    if (!cfg.FIREBASE_CONFIG || !cfg.FIREBASE_CONFIG.apiKey || !cfg.FIREBASE_CONFIG.projectId) {
      return null;
    }
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`${FIREBASE_SDK_BASE}/firebase-app.js`),
      import(`${FIREBASE_SDK_BASE}/firebase-auth.js`),
      import(`${FIREBASE_SDK_BASE}/firebase-firestore.js`)
    ]);
    const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(cfg.FIREBASE_CONFIG);
    const auth = authMod.getAuth(app);
    const db = fsMod.getFirestore(app);
    return { auth, db, authMod, fsMod };
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  function formatMarketLabel(m) {
    if (m === 'intl-fr') return 'International FR';
    if (m === 'intl-en') return 'International EN';
    if (m === 'local-mg') return 'Local Madagascar';
    return m || '-';
  }

  function toIsoDate(ts) {
    if (!ts) return '';
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toISOString();
    }
    return String(ts);
  }

  function buildProspectWhatsAppLink(row) {
    const rawNum = (row.whatsapp || '').replace(/[^0-9]/g, '');
    const isEn = row.market === 'intl-en' || row.lang === 'en';
    const text = isEn
      ? `Hello ${row.full_name}, thank you for contacting Missi Innovation regarding "${row.service_pole}". Confirming your slot on ${row.preferred_date} (${row.preferred_slot} EAT).`
      : `Bonjour ${row.full_name}, merci pour votre prise de contact avec Missi Innovation concernant « ${row.service_pole} ». Nous vous confirmons le créneau du ${row.preferred_date} (${row.preferred_slot} EAT).`;
    if (!rawNum) {
      return `https://wa.me/${cfg.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    }
    return `https://wa.me/${rawNum}?text=${encodeURIComponent(text)}`;
  }

  function populatePoleFilter(rows) {
    const select = document.getElementById('filter-pole');
    if (!select) return;
    const current = select.value;
    const poles = Array.from(new Set(rows.map((r) => r.service_pole).filter(Boolean))).sort();
    select.innerHTML = '<option value="all">Tous les pôles</option>';
    for (const p of poles) {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    }
    if (poles.includes(current)) select.value = current;
  }

  function updateKpis(rows) {
    const total = rows.length;
    const newCount = rows.filter((r) => r.status === 'Nouveau').length;
    const todayIso = new Date().toISOString().split('T')[0];
    const upcomingCount = rows.filter(
      (r) => (r.status === 'Confirmé' || r.status === 'Nouveau') && (!r.preferred_date || r.preferred_date >= todayIso)
    ).length;
    const signedCount = rows.filter((r) => r.status === 'Signé').length;
    const rate = total > 0 ? Math.round((signedCount / total) * 100) : 0;

    document.getElementById('kpi-new').textContent = String(newCount);
    document.getElementById('kpi-upcoming').textContent = String(upcomingCount);
    document.getElementById('kpi-total').textContent = String(total);
    document.getElementById('kpi-rate').textContent = `${rate} %`;
  }

  function getFilteredRows() {
    const q = (document.getElementById('filter-search')?.value || '').trim().toLowerCase();
    const market = document.getElementById('filter-market')?.value || 'all';
    const pole = document.getElementById('filter-pole')?.value || 'all';
    const status = document.getElementById('filter-status')?.value || 'all';

    return allRows.filter((r) => {
      if (market !== 'all' && r.market !== market) return false;
      if (pole !== 'all' && r.service_pole !== pole) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (q) {
        const hay = `${r.full_name} ${r.organization} ${r.whatsapp} ${r.email} ${r.message} ${r.internal_notes}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;
    const rows = getFilteredRows();

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#6B574C;padding:2rem;">Aucune réservation ne correspond aux filtres.</td></tr>';
      return;
    }

    const statuses = ['Nouveau', 'Confirmé', 'Démo effectuée', 'Devis envoyé', 'Signé', 'Archivé'];

    tbody.innerHTML = rows
      .map((r) => {
        const optionsHtml = statuses
          .map((s) => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s}</option>`)
          .join('');
        return `
        <tr data-id="${escapeHtml(r.id)}">
          <td>
            <strong>${escapeHtml(r.preferred_date || '-')}</strong><br>
            <span>${escapeHtml(r.preferred_slot || '-')} EAT</span><br>
            <small style="color:#6B574C;">Fuseau : ${escapeHtml(r.visitor_timezone || '-')}</small>
          </td>
          <td>
            <strong>${escapeHtml(r.full_name)}</strong>${r.organization ? `<br><span>${escapeHtml(r.organization)}</span>` : ''}
            ${r.whatsapp ? `<br><span class="mono" style="font-size:0.78rem;">WA: ${escapeHtml(r.whatsapp)}</span>` : ''}
            ${r.email ? `<br><span style="font-size:0.78rem;">${escapeHtml(r.email)}</span>` : ''}
            ${r.message ? `<p style="margin-top:0.35rem;font-size:0.78rem;color:#4A3329;">« ${escapeHtml(r.message)} »</p>` : ''}
          </td>
          <td>
            <span class="badge-market">${escapeHtml(formatMarketLabel(r.market))}</span><br>
            <strong style="display:inline-block;margin-top:0.35rem;">${escapeHtml(r.service_pole)}</strong>
          </td>
          <td>
            <select class="row-status-select" aria-label="Statut">${optionsHtml}</select>
            <textarea class="row-notes" aria-label="Notes internes" placeholder="Notes internes...">${escapeHtml(r.internal_notes || '')}</textarea>
          </td>
          <td>
            <div class="row-actions">
              <button type="button" class="btn btn-primary btn-sm btn-save-row">Enregistrer</button>
              <a href="${buildProspectWhatsAppLink(r)}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">Ouvrir WhatsApp</a>
              <button type="button" class="btn btn-danger btn-sm btn-delete-row">Supprimer</button>
            </div>
          </td>
        </tr>`;
      })
      .join('');
  }

  async function loadBookings() {
    if (!fb) return;
    const statusEl = document.getElementById('dash-status');
    if (statusEl) statusEl.textContent = 'Chargement...';

    try {
      const { db, fsMod } = fb;
      const q = fsMod.query(
        fsMod.collection(db, cfg.BOOKINGS_COLLECTION || 'bookings'),
        fsMod.orderBy('created_at', 'desc')
      );
      const snap = await fsMod.getDocs(q);
      allRows = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          ...data,
          id: d.id,
          created_at: toIsoDate(data.created_at)
        };
      });
      populatePoleFilter(allRows);
      updateKpis(allRows);
      renderTable();
      if (statusEl) {
        statusEl.style.color = '#4A5D4E';
        statusEl.textContent = `${allRows.length} réservation(s) chargée(s).`;
      }
    } catch (error) {
      if (statusEl) {
        statusEl.style.color = '#B91C1C';
        statusEl.textContent = `Erreur Firestore : ${error.message || error}`;
      }
    }
  }

  function exportCsv() {
    const rows = getFilteredRows();
    const headers = [
      'ID', 'Date_Ajout', 'Commercial', 'Marché (Local/Intl)', 'Entreprise', 'Secteur',
      'Décideur', 'Contact', 'Offre_Ciblée', 'Statut_Pipeline', 'Score_BANT', 'Date_Démo',
      'Montant_Devis', 'Devise', 'Date_Encaissement', 'Montant_Encaissé', 'Taux_Commission',
      'Commission_Due', 'Statut_Paiement_Comm', 'Notes'
    ];
    const escCsv = (val) => `"${String(val || '').replace(/"/g, '""')}"`;

    const lines = [headers.join(',')];
    for (const r of rows) {
      const marketCsv = r.market === 'local-mg' ? 'Local' : 'Intl';
      const contactCsv = [r.whatsapp, r.email].filter(Boolean).join(' / ');
      const notesCsv = [r.message, r.internal_notes].filter(Boolean).join(' | ');
      lines.push(
        [
          r.id,
          (r.created_at || '').slice(0, 10),
          'Direct / Admin',
          marketCsv,
          r.organization || r.full_name,
          r.service_pole,
          r.full_name,
          contactCsv,
          r.service_pole,
          r.status,
          '',
          r.preferred_date || '',
          '',
          marketCsv === 'Local' ? 'MGA' : 'EUR',
          '',
          '',
          '',
          '',
          '',
          notesCsv
        ]
          .map(escCsv)
          .join(',')
      );
    }

    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missi-reservations-crm-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function refreshAuthUi(user) {
    const isAdmin = Boolean(user && (!cfg.EMAIL_PRO || user.email === cfg.EMAIL_PRO));
    document.getElementById('auth-view').hidden = isAdmin;
    document.getElementById('dashboard-view').hidden = !isAdmin;
    document.getElementById('btn-logout').hidden = !isAdmin;

    if (user && !isAdmin && fb) {
      const err = document.getElementById('auth-error');
      if (err) {
        err.textContent = 'Compte non autorisé pour cet espace administrateur.';
        err.hidden = false;
      }
      await fb.authMod.signOut(fb.auth);
      return;
    }

    if (isAdmin) {
      await loadBookings();
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      fb = await initFirebase();
    } catch (_) {
      fb = null;
    }

    if (!fb) {
      const err = document.getElementById('auth-error');
      if (err) {
        err.textContent = 'Client Firebase non initialisé.';
        err.hidden = false;
      }
      return;
    }

    fb.authMod.onAuthStateChanged(fb.auth, (user) => {
      refreshAuthUi(user);
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const err = document.getElementById('auth-error');
        if (err) err.hidden = true;
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
          await fb.authMod.signInWithEmailAndPassword(fb.auth, email, password);
        } catch (error) {
          if (err) {
            err.textContent = error.message || 'Identifiants invalides.';
            err.hidden = false;
          }
        }
      });
    }

    document.getElementById('btn-logout')?.addEventListener('click', async () => {
      await fb.authMod.signOut(fb.auth);
      allRows = [];
    });

    document.getElementById('btn-refresh')?.addEventListener('click', loadBookings);
    document.getElementById('btn-export-csv')?.addEventListener('click', exportCsv);

    ['filter-search', 'filter-market', 'filter-pole', 'filter-status'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', renderTable);
      document.getElementById(id)?.addEventListener('change', renderTable);
    });

    document.getElementById('bookings-tbody')?.addEventListener('click', async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const tr = target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const statusEl = document.getElementById('dash-status');
      const collectionName = cfg.BOOKINGS_COLLECTION || 'bookings';

      if (target.classList.contains('btn-save-row')) {
        const statusVal = tr.querySelector('.row-status-select')?.value;
        const notesVal = tr.querySelector('.row-notes')?.value || '';
        try {
          await fb.fsMod.updateDoc(fb.fsMod.doc(fb.db, collectionName, id), {
            status: statusVal,
            internal_notes: notesVal
          });
          const item = allRows.find((r) => String(r.id) === String(id));
          if (item) {
            item.status = statusVal;
            item.internal_notes = notesVal;
          }
          updateKpis(allRows);
          if (statusEl) {
            statusEl.style.color = '#4A5D4E';
            statusEl.textContent = 'Modification enregistrée.';
          }
        } catch (error) {
          if (statusEl) {
            statusEl.style.color = '#B91C1C';
            statusEl.textContent = `Erreur sauvegarde : ${error.message || error}`;
          }
        }
      }

      if (target.classList.contains('btn-delete-row')) {
        if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
        try {
          await fb.fsMod.deleteDoc(fb.fsMod.doc(fb.db, collectionName, id));
          allRows = allRows.filter((r) => String(r.id) !== String(id));
          updateKpis(allRows);
          renderTable();
          if (statusEl) {
            statusEl.style.color = '#4A5D4E';
            statusEl.textContent = 'Réservation supprimée.';
          }
        } catch (error) {
          if (statusEl) {
            statusEl.style.color = '#B91C1C';
            statusEl.textContent = `Erreur suppression : ${error.message || error}`;
          }
        }
      }
    });
  });
})();
