document.addEventListener('DOMContentLoaded', () => {
    const addressModal = document.getElementById('address-modal');
    const addAddressBtn = document.getElementById('add-new-address-btn');
    const closeAddressModalBtn = document.getElementById('close-address-modal');
    const addressForm = document.getElementById('address-form');
    const addressListDiv = document.getElementById('address-list');
    const modalTitle = document.getElementById('modal-title');
    const addressIdInput = document.getElementById('address-id');
<<<<<<< HEAD
    const editDataBtn = document.getElementById('edit-data-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    let isEditingData = false;
=======

    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
>>>>>>> efa47ff8736db59a86fb5827275cc5527fd1d8fd

    const renderAddresses = () => {
        addressListDiv.innerHTML = '';
        if (addresses.length === 0) {
            addressListDiv.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
            return;
        }

        addresses.forEach(address => {
            const addressItem = document.createElement('div');
            addressItem.className = 'address-item';
            addressItem.innerHTML = `
                <div>
                    <p><strong>${address.street}, ${address.number}</strong></p>
                    <p>${address.neighborhood}, ${address.city} - ${address.state}</p>
                    <p>${address.zipcode}</p>
                </div>
                <div class="address-actions">
                    <button class="edit-btn" data-id="${address.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete-btn" data-id="${address.id}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            addressListDiv.appendChild(addressItem);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditAddress));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteAddress));
    };

    const openModal = (address = null) => {
        addressForm.reset();
        if (address) {
            modalTitle.textContent = 'Editar Endereço';
            addressIdInput.value = address.id;
            document.getElementById('zipcode').value = address.zipcode;
            document.getElementById('street').value = address.street;
            document.getElementById('number').value = address.number;
            document.getElementById('complement').value = address.complement;
            document.getElementById('neighborhood').value = address.neighborhood;
            document.getElementById('city').value = address.city;
            document.getElementById('state').value = address.state;
        } else {
            modalTitle.textContent = 'Adicionar Endereço';
            addressIdInput.value = '';
        }
        addressModal.classList.remove('hidden');
    };

    const closeModal = () => {
        addressModal.classList.add('hidden');
    };

    const saveAddress = (e) => {
        e.preventDefault();
        const formData = new FormData(addressForm);
        const address = {
            id: addressIdInput.value || Date.now().toString(),
            zipcode: formData.get('zipcode'),
            street: formData.get('street'),
            number: formData.get('number'),
            complement: formData.get('complement'),
            neighborhood: formData.get('neighborhood'),
            city: formData.get('city'),
            state: formData.get('state'),
        };

        if (addressIdInput.value) {
            addresses = addresses.map(addr => addr.id == address.id ? address : addr);
        } else {
            addresses.push(address);
        }

        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        renderAddresses();
        closeModal();
    };

    const handleEditAddress = (e) => {
        const addressId = e.currentTarget.dataset.id;
        const addressToEdit = addresses.find(addr => addr.id == addressId);
        openModal(addressToEdit);
    };
    
    const handleDeleteAddress = (e) => {
        const addressId = e.currentTarget.dataset.id;
        if (confirm('Tem certeza que deseja excluir este endereço?')) {
            addresses = addresses.filter(addr => addr.id != addressId);
            localStorage.setItem('userAddresses', JSON.stringify(addresses));
            renderAddresses();
        }
    };

<<<<<<< HEAD
    const toggleEditData = () => {
        isEditingData = !isEditingData;
        nameInput.disabled = !isEditingData;
        emailInput.disabled = !isEditingData;
        editDataBtn.textContent = isEditingData ? 'Salvar Alterações' : 'Editar Dados';
    };

    addAddressBtn.addEventListener('click', () => openModal());
    closeAddressModalBtn.addEventListener('click', closeModal);
    addressForm.addEventListener('submit', saveAddress);
    editDataBtn.addEventListener('click', toggleEditData);
=======
    addAddressBtn.addEventListener('click', () => openModal());
    closeAddressModalBtn.addEventListener('click', closeModal);
    addressForm.addEventListener('submit', saveAddress);
>>>>>>> efa47ff8736db59a86fb5827275cc5527fd1d8fd

    renderAddresses();
});