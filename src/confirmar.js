async function fetchOfferDetails(offerId) {
    const SPREADSHEET_ID = '1FXFHScHON1oaR2OsBo-cbxpZMfoxx9tt2S0YJuVibrE';
    
    try {
        // Usar URL relativa al protocolo (funciona con http y https)
        const response = await fetch(
            `//docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
        );

        console.log('Response:', response); // Para debugging

        if (!response.ok) {
            console.error('Response status:', response.status);
            throw new Error('Error al obtener datos de Google Sheets');
        }

        const text = await response.text();
        console.log('Datos crudos:', text); // Para debugging

        // Convertir CSV a array
        const rows = text.split('\n').map(row => 
            row.split(',').map(cell => 
                cell.replace(/^"|"$/g, '') // Remover comillas
            )
        );

        console.log('Filas procesadas:', rows); // Para debugging

        // La primera fila son los encabezados, buscar en las demás
        const offerRow = rows.slice(1).find(row => row[0] === offerId);

        if (!offerRow) {
            throw new Error('Oferta no encontrada');
        }

        // Mapear los datos según las columnas
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
        console.error('Error completo:', error);
        throw new Error('Error al obtener los detalles de la oferta: ' + error.message);
    }
}

async function handleAcceptOffer(offerId, driverPhone, offerDetails) {
    try {
        const response = await fetch('https://workflows.ops.sandbox.cuentamono.com/webhook/f3ff9ef5-218d-4c67-a1b1-04cc5c1a4674', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                offerId,
                driverPhone,
                status: 'accepted',
                ...offerDetails
            })
        });

        if (!response.ok) {
            throw new Error('Error al confirmar la oferta');
        }

        return true;
    } catch (error) {
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const offerId = params.get('id');
    const driverPhone = params.get('tel');

    console.log('Parámetros URL recibidos:', { 
        offerId, 
        driverPhone,
        rawParams: window.location.search // Ver los parámetros completos
    });

    if (!offerId || !driverPhone) {
        console.log('Parámetros faltantes o inválidos:', { 
            offerId: offerId || 'falta', 
            driverPhone: driverPhone || 'falta'
        });
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = 'Parámetros inválidos';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }

    try {
        console.log('Iniciando búsqueda de oferta:', {
            buscandoId: offerId,
            telefonoRecibido: driverPhone
        });
        
        const offerDetails = await fetchOfferDetails(offerId);
        
        console.log('Detalles encontrados:', offerDetails); // Debugging
        
        document.getElementById('offerId').textContent = offerId;
        document.getElementById('origin').textContent = offerDetails.origin;
        document.getElementById('destination').textContent = offerDetails.destination;
        document.getElementById('cargo').textContent = offerDetails.cargo;
        document.getElementById('vehicleType').textContent = offerDetails.vehicleType;
        document.getElementById('weight').textContent = offerDetails.weight;
        document.getElementById('client').textContent = offerDetails.client;

        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('offerContent').style.display = 'block';

        document.getElementById('acceptButton').addEventListener('click', async () => {
            try {
                console.log('Intentando aceptar oferta:', {
                    offerId,
                    driverPhone,
                    detallesCompletos: offerDetails
                });
                
                await handleAcceptOffer(offerId, driverPhone, offerDetails);
                console.log('Oferta aceptada exitosamente');
                alert('Oferta aceptada correctamente');
                window.close();
            } catch (error) {
                console.error('Error en aceptación:', {
                    error,
                    offerId,
                    driverPhone
                });
                alert('Error al aceptar la oferta: ' + error.message);
            }
        });

        document.getElementById('rejectButton').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas rechazar esta oferta?')) {
                window.close();
            }
        });

    } catch (error) {
        console.error('Error en proceso:', {
            error,
            offerId,
            driverPhone
        });
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('errorMessage').textContent = error.message;
        document.getElementById('errorMessage').style.display = 'block';
    }
}); 