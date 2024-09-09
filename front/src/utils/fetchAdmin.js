const endpoint = import.meta.env.VITE_API_URL


export async function fetchGetStatistics(token) {
    const response = await fetch(`${endpoint}/client/statistics`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json(); // Suppose que l'erreur est en format JSON
        const errorMessage = errorData.message || 'Erreur de récupération des statistiques. Veuillez réessayer.';
        throw new Error(errorMessage);
    }
}

export async function fetchGetUsers(token) {
    const response = await fetch(`${endpoint}/client`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json();
    } else {
        const errorData = await response.json(); // Suppose que l'erreur est en format JSON
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
        const errorData = await response.json(); // Suppose que l'erreur est en format JSON
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