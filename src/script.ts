interface Commodities {
    id?: string;
    itemNumber: number;
    itemNames: string;
    itemPrices: number;
}

let isUpdating = false;
let currentCommodityId: string | null = null;

async function fetchCommodity(): Promise<Commodities[]> {
    const response = await fetch('http://localhost:3000/commodities');
    if (!response.ok) {
        throw new Error('Error fetching commodities');
    }
    const data = await response.json();
    console.log('FETCHED ITEMS', data);
    return data;
}

async function saveCommodity(commodity: Commodities): Promise<void> {
    const response = await fetch('http://localhost:3000/commodities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commodity)
    });
    if (!response.ok) {
        throw new Error('Error saving commodity');
    }
}

async function deleteCommodity(id: string): Promise<void> {
    const response = await fetch(`http://localhost:3000/commodities/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting commodity');
    }
    console.log(`Commodity with id: ${id} deleted successfully`);
}

async function updateCommodity(id: string, updatedCommodity: Commodities): Promise<void> {
    const response = await fetch(`http://localhost:3000/commodities/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCommodity)
    });
    if (!response.ok) {
        throw new Error('Error updating commodity');
    }
    console.log(updatedCommodity);
}

async function createOrUpdateCommodity(event: Event): Promise<void> {
    event.preventDefault();

    const itemNo = document.querySelector('#no') as HTMLInputElement;
    const itemName = document.querySelector('#text') as HTMLInputElement;
    const itemPrice = document.querySelector('#price') as HTMLInputElement;
    const form = document.querySelector('.form') as HTMLFormElement

    if (!itemNo.value || !itemName.value || !itemPrice.value) {
        console.log("Fill all fields");
        const error = document.createElement('p');
        error.className = 'error';
        error.textContent = 'Please fill in all fields';
        form.appendChild(error);
        return;
    }

    const newCommodity: Commodities = {
        itemNumber: parseInt(itemNo.value, 10),
        itemNames: itemName.value,
        itemPrices: parseFloat(itemPrice.value)
    }

    try {
        if (isUpdating && currentCommodityId !== null) {
            await updateCommodity(currentCommodityId, newCommodity);
            isUpdating = false;
            currentCommodityId = null;
            document.querySelector('#create')!.textContent = 'Create Item';
        } else {
            await saveCommodity(newCommodity);
        }
        const items = await fetchCommodity();
        displayCommodity(items);
    } catch (error) {
        console.error('Error saving commodity:', error);
    }

    itemNo.value = '';
    itemName.value = '';
    itemPrice.value = '';
}

function displayCommodity(items: Commodities[]): void {
    const itemsContainer = document.querySelector('.items') as HTMLDivElement;
    itemsContainer.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const itemCont = document.createElement('div');
        itemCont.className = 'itemCont';
        itemCont.innerHTML = `
            <p>Item Number: ${item.itemNumber}</p>
            <p>Item Name: ${item.itemNames}</p>
            <p>Item Price: ${item.itemPrices}</p>
            <button class="updateBtn" data-id="${item.id}">Update</button>
            <button class="deleteBtn" data-id="${item.id}">Delete</button>
        `;
        itemsContainer.appendChild(itemCont);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
            try {
                await deleteCommodity(id);
                const items = await fetchCommodity();
                displayCommodity(items);
            } catch (error) {
                console.error('Error deleting commodity:', error);
            }
        });
    });

    document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            const id = target.dataset.id!;
            const item = items.find(i => i.id === id);
            if (item) {
                const itemNo = document.querySelector('#no') as HTMLInputElement;
                const itemName = document.querySelector('#text') as HTMLInputElement;
                const itemPrice = document.querySelector('#price') as HTMLInputElement;

                itemNo.value = item.itemNumber.toString();
                itemName.value = item.itemNames;
                itemPrice.value = item.itemPrices.toString();

                document.querySelector('#create')!.textContent = 'Update Item';
                isUpdating = true;
                currentCommodityId = id;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const createItemButton = document.querySelector('#create') as HTMLButtonElement;
    createItemButton.addEventListener('click', createOrUpdateCommodity);

    const viewAllButton = document.querySelector('#viewAll') as HTMLButtonElement;
    viewAllButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const items = await fetchCommodity();
            displayCommodity(items);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    });
});
