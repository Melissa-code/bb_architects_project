const endpoint = import.meta.env.VITE_API_URL

export async function fetchLogin(data) {
    const response = await fetch(`${endpoint}/login_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de connexion. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchRegister(data) {
    const response = await fetch(`${endpoint}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Erreur d'inscription. Veuillez réessayer.`;
        throw new Error(errorMessage);
    }
}

export async function fetchGetProfile(token) {
    const response = await fetch(`${endpoint}/profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération du profil. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetFiles(token) {
    const response = await fetch(
        `${endpoint}/files?sortField=createdAt&sortOrder=ASC`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des fichiers. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchCreateFile(data, token) {
    const response = await fetch(`${endpoint}/file/create_file`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data,
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Erreur d'upload. Veuillez réessayer.`;
        throw new Error(errorMessage);
    }
}

export async function fetchUpdateFile(data, token) {
    const response = await fetch(
        `${endpoint}/file/update_file/${data.fileId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    )

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de mise à jour du fichier. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchDeleteFile(id, token) {
    const response = await fetch(`${endpoint}/file/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de suppression du fichier. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetCategories(token) {
    const response = await fetch(`${endpoint}/category`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des catégories. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetUsers(token) {
    const response = await fetch(`${endpoint}/client`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des utilisateurs. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetUserFiles(id, token) {
    const response = await fetch(`${endpoint}/client/files/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des fichiers. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchDownloadFile(id, token) {
    const response = await fetch(`${endpoint}/client/file/download/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json(); // Suppose que l'erreur est en format JSON
        const errorMessage = errorData.message || 'Erreur lors du téléchargement. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetInvoice(token) {
    const response = await fetch(`${endpoint}/invoice`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des factures. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchDeleteUser(token, id) {
    const response = await fetch(`${endpoint}/delete_user/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    
    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erreur de récupération des factures. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}