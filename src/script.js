document.getElementById('origin').addEventListener('change', function(e) {
    const customInput = document.getElementById('originCustom');
    if (this.value === 'otra') {
        this.style.display = 'none';
        customInput.style.display = 'block';
        customInput.required = true;
        this.required = false;
    }
});

document.getElementById('destination').addEventListener('change', function(e) {
    const customInput = document.getElementById('destinationCustom');
    if (this.value === 'otra') {
        this.style.display = 'none';
        customInput.style.display = 'block';
        customInput.required = true;
        this.required = false;
    }
});

document.getElementById('transportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const originSelect = document.getElementById('origin');
    const originCustom = document.getElementById('originCustom');
    const destinationSelect = document.getElementById('destination');
    const destinationCustom = document.getElementById('destinationCustom');

    const originValue = originSelect.value === 'otra' ? originCustom.value : originSelect.value;
    const destinationValue = destinationSelect.value === 'otra' ? destinationCustom.value : destinationSelect.value;

    const formData = {
        offerId: document.getElementById('offerId').value,
        client: document.getElementById('client').value,
        totalWeight: document.getElementById('totalWeight').value,
        vehicleType: document.getElementById('vehicleType').value,
        origin: originValue,
        destination: destinationValue,
        cargo: document.getElementById('cargo').value
    };

    try {
        const response = await fetch('https://workflows.ops.sandbox.cuentamono.com/webhook/7003755d-eeb6-4463-9ffa-101b8f7629fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Solicitud enviada correctamente');
            this.reset();
            originSelect.style.display = 'block';
            originCustom.style.display = 'none';
            destinationSelect.style.display = 'block';
            destinationCustom.style.display = 'none';
            originSelect.required = true;
            originCustom.required = false;
            destinationSelect.required = true;
            destinationCustom.required = false;
        } else {
            throw new Error('Error al enviar la solicitud');
        }
    } catch (error) {
        alert('Error al enviar la solicitud: ' + error.message);
    }
}); 