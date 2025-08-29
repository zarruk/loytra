async function fetchOfferDetails(offerId) {
    const SPREADSHEET_ID = '1hE0HrjgxvCuCl2g_m_OVpDo-HucANW4ph6HV0W4yFfs';
    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
        );
        if (!response.ok) throw new Error('Error al obtener datos de Google Sheets');
        const text = await response.text();
        // Convertir CSV a array
        const rows = text.split('\n').map(row => 
            row.split(',').map(cell => 
                cell.replace(/^"|"$/g, '') // Remover comillas
            )
        );

        // La primera fila son los encabezados
        const headers = rows[0];
        console.log('Encabezados encontrados:', headers); // Para debugging

        // Buscar el índice de la columna "id_oferta"
        const idOfertaIndex = headers.findIndex(header => header.trim().toLowerCase() === 'id_oferta');
        console.log('Índice de columna id_oferta:', idOfertaIndex); // Para debugging

        if (idOfertaIndex === -1) {
            throw new Error('Columna "id_oferta" no encontrada en la hoja de cálculo');
        }

        // Buscar en la columna id_oferta
        const offerRow = rows.slice(1).find(row => row[idOfertaIndex] === offerId);

        if (!offerRow) {
            throw new Error('Oferta no encontrada');
        }

        // Mapear los datos según las columnas por nombre
        const getColumnValue = (columnName) => {
            const index = headers.findIndex(header => header.trim().toLowerCase() === columnName.toLowerCase());
            return index !== -1 ? offerRow[index] : 'No disponible';
        };

        return {
            offerId: getColumnValue('id_oferta'),
            origin: getColumnValue('origen'),
            destination: getColumnValue('destino'),
            cargo: getColumnValue('mercancia'),
            vehicleType: getColumnValue('tipo_de_vehiculo'),
            client: getColumnValue('cliente'),
            placaVehiculo: getColumnValue('placa_vehiculo'),
            claseVehiculo: getColumnValue('clase_vehiculo'),
            carroceria: getColumnValue('carroceria'),
            valorRemesa: getColumnValue('valor_remesa'),
            nombre: getColumnValue('nombre'),
            apellidos: getColumnValue('apellidos'),
            telefono: getColumnValue('telefono'),
            cc: getColumnValue('cc')
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
        document.getElementById('origin').textContent = offerDetails.origin;
        document.getElementById('destination').textContent = offerDetails.destination;
        document.getElementById('cargo').textContent = offerDetails.cargo;
        document.getElementById('vehicleType').textContent = offerDetails.vehicleType;
        document.getElementById('client').textContent = offerDetails.client;
        document.getElementById('placaVehiculo').textContent = offerDetails.placaVehiculo;
        document.getElementById('claseVehiculo').textContent = offerDetails.claseVehiculo;
        document.getElementById('carroceria').textContent = offerDetails.carroceria;
        document.getElementById('valorRemesa').textContent = offerDetails.valorRemesa;
        document.getElementById('nombre').textContent = offerDetails.nombre;
        document.getElementById('apellidos').textContent = offerDetails.apellidos;
        document.getElementById('telefono').textContent = offerDetails.telefono;
        document.getElementById('cc').textContent = offerDetails.cc;
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('offerContent').style.display = 'block';
    } catch (error) {
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = error.message;
        document.getElementById('errorMessage').style.display = 'block';
    }
});


