import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import {Formik, Form} from 'formik'
import {registerSchema} from '../validation/validation'
import {TextField, Button, Divider, MenuItem} from '@mui/material'
import {countries} from '../datas/countries'
import {useMutation} from '@tanstack/react-query'
import {fetchRegister} from '../utils/fetch'
import {useState} from 'react'
import AlertSuccess from './notification/alerts/AlertSuccess'
import AlertFail from './notification/alerts/AlertFail'
import Box from "@mui/material/Box";

function RegisterForm() {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailure, setOpenFailure] = useState(false)

    const alertSuccessMessage = "Inscription réussie. Redirection"
    const alertFailMessage = "Erreur lors de l'inscription. Veuillez réessayer"

    const {mutate} = useMutation({
        mutationKey: ['register'],
        mutationFn: (variables) => fetchRegister(variables),
        onSuccess: () => {
            setOpenSuccess(true)
        },
        onError: (error) => {
            console.log(error)
            setOpenFailure(true)
        },
    })

    function handleSubmit(values, setSubmitting) {
        mutate(values)
        setSubmitting(false)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                p: 2,
            }}
        >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Inscription
            </Typography>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstname: '',
                    lastname: '',
                    phone: '',
                    number_street: '',
                    street: '',
                    zipcode: '',
                    city: '',
                    country: '',
                    storage_space: true,
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={registerSchema}
                onSubmit={(values, {setSubmitting}) => handleSubmit(values, setSubmitting)}
            >
                {({values, handleChange, handleBlur, touched, errors}) => (
                    <Box component={Form} noValidate sx={{width: '100%', mt: 2}}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            type="email"
                            label="Adresse e-mail"
                            placeholder="johndoe@mail.com"
                            margin="normal"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            type="password"
                            label="Mot de passe"
                            placeholder="**********"
                            margin="normal"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <TextField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirmez le mot de passe"
                            placeholder="**********"
                            margin="normal"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                        />
                        <Divider sx={{my: 2}}/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    label="Nom"
                                    placeholder="Doe"
                                    margin="normal"
                                    value={values.lastname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.lastname && Boolean(errors.lastname)}
                                    helperText={touched.lastname && errors.lastname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    label="Prénom"
                                    placeholder="John"
                                    margin="normal"
                                    value={values.firstname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.firstname && Boolean(errors.firstname)}
                                    helperText={touched.firstname && errors.firstname}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            id="number_street"
                            name="number_street"
                            type="number"
                            label="Numéro"
                            placeholder="1"
                            margin="normal"
                            value={values.number_street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.number_street && Boolean(errors.number_street)}
                            helperText={touched.number_street && errors.number_street}
                        />
                        <TextField
                            fullWidth
                            id="street"
                            name="street"
                            type="text"
                            label="Rue"
                            placeholder="rue des Castagnettes"
                            margin="normal"
                            value={values.street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.street && Boolean(errors.street)}
                            helperText={touched.street && errors.street}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="zipcode"
                                    name="zipcode"
                                    type="number"
                                    label="Code postal"
                                    placeholder="75000"
                                    margin="normal"
                                    value={values.zipcode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.zipcode && Boolean(errors.zipcode)}
                                    helperText={touched.zipcode && errors.zipcode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="city"
                                    name="city"
                                    type="text"
                                    label="Ville"
                                    placeholder="Paris"
                                    margin="normal"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.city && Boolean(errors.city)}
                                    helperText={touched.city && errors.city}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            id="country"
                            name="country"
                            select
                            label="Pays"
                            margin="normal"
                            value={values.country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.country && Boolean(errors.country)}
                            helperText={touched.country && errors.country}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country} value={country}>
                                    {country}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            type="tel"
                            label="Téléphone"
                            placeholder="01 02 03 04 05"
                            margin="normal"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{mt: 2}}
                        >
                            S&apos;inscrire
                        </Button>
                    </Box>
                )}
            </Formik>

            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        {'Mot de passe oublié ?'}
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/login" variant="body2">
                        {'Déjà un compte ? Connectez-vous'}
                    </Link>
                </Grid>
            </Grid>

            <AlertSuccess open={openSuccess} setOpen={setOpenSuccess} type={"register"} message={alertSuccessMessage}/>
            <AlertFail open={openFailure} setOpen={setOpenFailure} alert={alertFailMessage}/>
        </Box>
    )
}

export default RegisterForm
