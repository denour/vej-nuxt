// utils/contact.js

/**
 * Guarda un contacto en tu base de datos
 * @param {Object} contact - { name, email, phone }
 * @returns {Promise<Object>} - respuesta del servidor
 */
export async function submitForm(contact: any) {
    try {
        const response = await fetch('/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })

        if (!response.ok) {
            throw new Error(`Error guardando contacto: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Suscribe un email al newsletter
 * @param {string} email
 * @returns {Promise<Object>} - respuesta del servidor o API de newsletter
 */
export async function subscribeNewsletter(email: string) {
    try {
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })

        if (!response.ok) {
            throw new Error(`Error suscribiendo al newsletter: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}
