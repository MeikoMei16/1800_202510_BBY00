import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db, auth } from '/src/firebase.ts';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    DocumentSnapshot,
    QuerySnapshot,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Function to render items
async function renderItems(): Promise<void> {
    const itemsList = document.getElementById('itemsList') as HTMLDivElement | null;
    if (!itemsList) return;

    itemsList.innerHTML = '<h2>Items</h2>';
    const user = auth.currentUser;

    if (!user) {
        itemsList.innerHTML += '<p>Please sign in to view items</p>';
        return;
    }

    try {
        const querySnapshot: QuerySnapshot = await getDocs(collection(db, 'items'));
        querySnapshot.forEach((docSnapshot: DocumentSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.userId === user.uid) {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <strong>${data.name}</strong>
                    <p>${data.description || ''}</p>
                `;
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'btn btn-sm btn-outline-primary';
                editButton.addEventListener('click', () => updateItem(docSnapshot.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'btn btn-sm btn-outline-danger';
                deleteButton.addEventListener('click', () => deleteItem(docSnapshot.id));

                div.appendChild(editButton);
                div.appendChild(deleteButton);
                itemsList.appendChild(div);
            }
        });
    } catch (error) {
        console.error('Error getting items: ', error);
    }
}

// Add new item
async function addItem(): Promise<void> {
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const descriptionInput = document.getElementById('description') as HTMLInputElement | null;
    const user = auth.currentUser;

    if (!user) {
        console.error('No user signed in');
        return;
    }

    const name = nameInput?.value || '';
    const description = descriptionInput?.value || '';

    try {
        await addDoc(collection(db, 'items'), {
            name,
            description,
            userId: user.uid,
            timestamp: serverTimestamp(),
        });
        if (nameInput) nameInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        await renderItems();
    } catch (error) {
        console.error('Error adding item: ', error);
    }
}

// Update item
async function updateItem(id: string): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
        console.error('No user signed in');
        return;
    }

    const newName = prompt('Enter new name:');
    const newDescription = prompt('Enter new description:');

    if (newName) {
        try {
            await updateDoc(doc(db, 'items', id), {
                name: newName,
                description: newDescription || '',
                userId: user.uid,
                timestamp: serverTimestamp(),
            });
            await renderItems();
        } catch (error) {
            console.error('Error updating item: ', error);
        }
    }
}

// Delete item
async function deleteItem(id: string): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
        console.error('No user signed in');
        return;
    }

    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await deleteDoc(doc(db, 'items', id));
            await renderItems();
        } catch (error) {
            console.error('Error deleting item: ', error);
        }
    }
}

// Logout function
async function logout(): Promise<void> {
    try {
        await signOut(auth);
        window.location.assign('/index.html'); // Redirect to landing page
    } catch (error) {
        console.error('Error signing out: ', error);
    }
}

// Initial render and setup
renderItems();
onSnapshot(collection(db, 'items'), () => {
    renderItems();
});
// Event listeners
const addItemButton = document.getElementById('addItemButton') as HTMLButtonElement | null;
if (addItemButton) {
    addItemButton.addEventListener('click', addItem);
}

const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement | null;
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}