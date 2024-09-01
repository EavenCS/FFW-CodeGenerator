let gewerke = [];

// Funktion zur Erstellung eines neuen Gewerks
function addGewerk() {
    const gewerk = getGewerkData();
    if (gewerk) {
        gewerke.push(gewerk);
        displayGewerk(gewerk);
        clearGewerkFields();
    }
}

// Daten eines Gewerks aus den Eingabefeldern auslesen
function getGewerkData() {
    const gewerkName = document.getElementById('gewerkeName').value;
    const gewerkKraefte = document.getElementById('gewerkeKraefte').value;
    const gewerkSonderinfo = document.getElementById('gewerkeSonderinfo').value;

    if (gewerkName && gewerkKraefte) {
        return {
            name: gewerkName,
            kraefte: gewerkKraefte,
            sonderinfo: gewerkSonderinfo
        };
    }
    return null;
}

// Anzeige des hinzugefügten Gewerks im Bericht
function displayGewerk(gewerk) {
    const gewerkeList = document.getElementById('gewerkeList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${gewerk.name}</strong> - Stärke: 1:${gewerk.kraefte}${gewerk.sonderinfo ? '<br><em>Sonderinformationen:</em> ' + gewerk.sonderinfo : ''}`;
    gewerkeList.appendChild(listItem);
}

// Zurücksetzen der Eingabefelder für ein Gewerk
function clearGewerkFields() {
    document.getElementById('gewerkeName').value = '';
    document.getElementById('gewerkeKraefte').value = '';
    document.getElementById('gewerkeSonderinfo').value = '';
}

// Funktion zur Erstellung eines neuen Einsatzes
function addEinsatz() {
    const einsatz = getEinsatzData();
    if (einsatz) {
        displayEinsatz(einsatz);
        clearEinsatzFields();
        gewerke = [];  // Zurücksetzen der Gewerke nach dem Hinzufügen eines Einsatzes
        document.getElementById('gewerkeList').innerHTML = '';
    }
}

// Daten eines Einsatzes aus den Eingabefeldern auslesen
function getEinsatzData() {
    return {
        art: document.getElementById('einsatzArt').value,
        datum: document.getElementById('einsatzDatum').value,
        startzeit: document.getElementById('einsatzStartzeit').value,
        endzeit: document.getElementById('einsatzEndzeit').value,
        leiter: document.getElementById('einsatzLeiter').value,
        beschreibung: document.getElementById('einsatzBeschreibung').value,
        fahrzeuge: Array.from(document.getElementById('einsatzFahrzeuge').selectedOptions).map(option => option.value),
        kraefte: document.getElementById('einsatzKraefte').value,
        gewerke: gewerke
    };
}

// Anzeige des hinzugefügten Einsatzes im Bericht
function displayEinsatz(einsatz) {
    const reportSection = document.getElementById('reportSection');
    const entry = document.createElement('div');
    entry.className = 'report-entry';

    let gewerkeText = '';
    if (einsatz.gewerke.length > 0) {
        gewerkeText = '<strong>Weitere Gewerke:</strong><ul>';
        einsatz.gewerke.forEach(g => {
            gewerkeText += `<li>${g.name} - Stärke: 1:${g.kraefte}${g.sonderinfo ? '<br><em>Sonderinformationen:</em> ' + g.sonderinfo : ''}</li>`;
        });
        gewerkeText += '</ul>';
    }

    entry.innerHTML = `
        <h3>${einsatz.art} - ${einsatz.datum}</h3>
        <p><strong>Zeitraum:</strong> ${einsatz.startzeit} - ${einsatz.endzeit}</p>
        <p><strong>Einsatzleiter:</strong> ${einsatz.leiter}</p>
        <p><strong>Beschreibung:</strong> ${einsatz.beschreibung}</p>
        <p><strong>Einsatzfahrzeuge:</strong> ${einsatz.fahrzeuge.join(', ')}</p>
        <p><strong>Stärke:</strong> 1:${einsatz.kraefte}</p>
        ${gewerkeText}
    `;

    reportSection.appendChild(entry);
}

// Zurücksetzen der Eingabefelder für einen Einsatz
function clearEinsatzFields() {
    document.getElementById('einsatzArt').value = 'Hilfeleistung H0';
    document.getElementById('einsatzDatum').value = '';
    document.getElementById('einsatzStartzeit').value = '';
    document.getElementById('einsatzEndzeit').value = '';
    document.getElementById('einsatzLeiter').value = '';
    document.getElementById('einsatzBeschreibung').value = '';
    document.getElementById('einsatzFahrzeuge').selectedIndex = -1;
    document.getElementById('einsatzKraefte').value = '';
}

// Export des Berichts als PDF mit Logo und Header
function exportPDF() {
    const pdf = new jsPDF();

    const reportSection = document.getElementById('reportSection');
    const logoImg = new Image();
    logoImg.src = 'URL_ZUM_LOGO'; // Hier URL zum Logo hinzufügen oder Base64-String verwenden

    logoImg.onload = function() {
        // Header erstellen
        pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30); // Logo oben links platzieren
        pdf.setFontSize(20);
        pdf.text(50, 20, 'Einsatzbericht');
        pdf.setFontSize(12);
        pdf.text(50, 30, 'Freiwillige Feuerwehr Winzenburg');
        pdf.text(50, 35, 'Datum: ' + new Date().toLocaleDateString());

        // Linie unter dem Header
        pdf.line(10, 45, 200, 45);

        // Inhalt des Berichts
        let y = 55;
        reportSection.querySelectorAll('.report-entry').forEach(entry => {
            pdf.setFontSize(16);
            pdf.text(10, y, entry.querySelector('h3').textContent);
            y += 10;

            pdf.setFontSize(12);
            entry.querySelectorAll('p').forEach(p => {
                let textLines = pdf.splitTextToSize(p.textContent, 180);
                pdf.text(10, y, textLines);
                y += textLines.length * 7;
            });

            y += 10;  // Add some space before the next entry
            if (y > 280) {  // Create new page if the space is running out
                pdf.addPage();
                y = 10;
            }
        });

        pdf.save('Einsatzbericht.pdf');
    };
}
