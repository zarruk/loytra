async function fetchOfferDetails(offerId) {
    const SPREADSHEET_ID = '1hE0HrjgxvCuCl2g_m_OVpDo-HucANW4ph6HV0W4yFfs';
    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
        );
        if (!response.ok) throw new Error('Error al obtener datos de Google Sheets');
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/^"|"$/g, '')));
        const offerRow = rows.slice(1).find(row => row[0] === offerId);
        if (!offerRow) throw new Error('Oferta no encontrada');
        return {
            offerId: offerRow[0],
            origin: offerRow[1],
            destination: offerRow[2],
            cargo: offerRow[3],
            weight: offerRow[4],
            vehicleType: offerRow[5],
            client: offerRow[6]
        };
    } catch (error) {
        throw new Error('Error al obtener los detalles de la oferta: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const offerId = params.get('id');

    if (!offerId) {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = 'Parámetro id es requerido';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }

    try {
        const offerDetails = await fetchOfferDetails(offerId);
        document.getElementById('offerId').textContent = offerId;
        document.getElementById('origin').textContent = offerDetails.origin;
        document.getElementById('destination').textContent = offerDetails.destination;
        document.getElementById('cargo').textContent = offerDetails.cargo;
        document.getElementById('vehicleType').textContent = offerDetails.vehicleType;
        document.getElementById('weight').textContent = offerDetails.weight;
        document.getElementById('client').textContent = offerDetails.client;
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('offerContent').style.display = 'block';
    } catch (error) {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = error.message;
        document.getElementById('errorMessage').style.display = 'block';
    }
});


