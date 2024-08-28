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
        return response.json()
    } else {
        // TODO : récupérer l'erreur du backend
        console.error(response)
        throw new Error('Erreur de connexion. Veuillez réessayer.')
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
        return response.json()
    } else {
        // TODO : récupérer l'erreur du backend
        throw new Error('Erreur de connexion. Veuillez réessayer.')
    }
}

export async function fetchGetProfile(token) {
    const response = await fetch(`${endpoint}/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authentication: `Bearer ${token}`,
        },
    })

    if (response.ok) {
        return response.json()
    } else {
        throw new Error(`Erreur d'accès au profil. Veuillez réessayer.`)
    }
}

export async function fetchGetFiles(token) {
    const response = await fetch(
        `${endpoint}/files?sortField=createdAt&sortOrder=ASC`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Erreur récupréation des fichiers. Veuillez réessayer`)
    }

    return response.json()
}
