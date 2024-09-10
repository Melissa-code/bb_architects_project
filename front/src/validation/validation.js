import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required(`L'email est requis`)
        .email('Veuillez saisir une adresse valide'),
    password: Yup.string().required('Le mot de passe est requis'),
});

export const registerSchema = Yup.object().shape({
    email: Yup.string().required(`L'email est requis`).email('Veuillez saisir une adresse mail valide'),
    password: Yup.string()
        .required('Un mot de passe requis')
        .min(10, 'Le mot de passe doit faire au moins 10 caractères')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
            'Le mot de passe doit contenir au moins, une majuscule, une minuscule, un chiffre et un caractère spécial.'
        ),
    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref('password'), null],
            'Les mots de passe doivent correspondre'
        )
        .required('La confirmation est requise'),
    firstname: Yup.string()
        .matches(/^[a-zA-Zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/, "Votre prénom ne doit comporter que des lettres")
        .required('Un prénom est requis'),
    lastname: Yup.string()
        .matches(/^[a-zA-Zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/, "Votre nom ne doit comporter que des lettres")
        .required('Un nom est requis'),
    phone: Yup.string()
        .matches(/^(?:0|\+33 ?|0?0?33 ?|)([1-9] ?(?:[0-9] ?){8})$/i, "Saisir un numéro de téléphone valide")
        .required('Un numéro de téléphone est requis'),
});
