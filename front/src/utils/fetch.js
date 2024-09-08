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
            Authorization: `Bearer ${token}`,
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
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (response.ok) {
        return await response.json()
    }
    throw new Error(`Erreur récupération des fichiers. Statut : ${response.status}`)
}

export async function fetchCreateFile(data, token) {
    console.log("data submitted", data)
    const formData = new FormData()
    formData.append('pathFile', data.pathFile)
    formData.append('name', data.name)
    formData.append('categoryId', data.categoryId)

    const response = await fetch(`${endpoint}/file/create_file`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    if (response.ok) {
        return response.json()
    } else {
        // TODO : récupérer l'erreur du backend
        console.error(response)
        throw new Error('Erreur de connexion. Veuillez réessayer.')
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
        return response.json()
    } else {
        throw new Error(`Erreur mise à jour du fichier. Statut : ${response.status}`)
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
        return response.json()
    } else {
        throw new Error(`Erreur lors de la suppression du fichier. Statut : ${response.status}`)
    }
}

export async function fetchGetCategories(token) {
    const response = await fetch(`${endpoint}/category`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur récupréation des fichiers. Veuillez réessayer`)
    }

    return response.json()
}

export async function fetchGetUsers(token) {
    const response = await fetch(`${endpoint}/client`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des utilisateurs. Veuillez réessayer`)
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