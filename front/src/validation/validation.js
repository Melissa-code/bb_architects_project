import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required(`L'email est requis`)
        .email('Veuillez saisir une adresse valide'),
    password: Yup.string().required('Le mot de passe est requis'),
})

export const registerSchema = Yup.object().shape({
    email: Yup.string().required(`L'email est requis`).email(),
    password: Yup.string()
        .required('Un mot de passe requis')
        .min(6, 'Le mot de passe doit faire au moins 6 caractères'),
    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref('password'), null],
            'Les mots de passe doivent correspondre'
        )
        .required('La confirmation est requise'),
    firstname: Yup.string()
        .matches(/^[a-zA-Zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/)
        .required('Un prénom est requis'),
    lastname: Yup.string()
        .matches(/^[a-zA-Zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/)
        .required('Un nom est requis'),
    phone: Yup.string()
        .matches(/^(?:0|\+33 ?|0?0?33 ?|)([1-9] ?(?:[0-9] ?){8})$/i)
        .required('Un numéro de téléphone est requis'),
})
