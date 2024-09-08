const endpoint = import.meta.env.VITE_API_URL


export async function fetchGetStatistics(token) {
    const response = await fetch(`${endpoint}/client/statistics`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des statistiques. Response status: ${response.status}`);
    }

    return response.json()
}

export async function fetchGetUsers(token) {
    const response = await fetch(`${endpoint}/client`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des utilisateurs. Response status: ${response.status}`)
    }

    return response.json()
}

export async function fetchGetUserFiles(id, token) {
    const response = await fetch(`${endpoint}/client/files/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des utilisateurs. Veuillez réessayer`)
    }

    return response.json()
}

export async function fetchDownloadFile(id, token) {
    const response = await fetch(`${endpoint}/client/file/download/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des utilisateurs. Veuillez réessayer`)
    }

    return response.json()
}