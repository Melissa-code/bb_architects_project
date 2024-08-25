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
import {useNavigate} from 'react-router-dom'

function RegisterForm() {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailure, setOpenFailure] = useState(false)
    const navigate = useNavigate()

    const {mutate} = useMutation({
        mutationKey: ['register'],
        mutationFn: (variables) => fetchRegister(variables),
        onSuccess: () => {
            setOpenSuccess(true)
            navigate('/connect/login')
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
        <>
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlinedIcon />
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
                    number_street: 0,
                    street: '',
                    zipcode: 0,
                    city: '',
                    country: '',
                    storage_space: true,
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={registerSchema}
                onSubmit={(values, setSubmitting) =>
                    handleSubmit(values, setSubmitting)
                }>
                {({values, handleChange, handleBlur, touched, errors}) => (
                    <Form>
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
                            error={
                                touched.confirmPassword &&
                                Boolean(errors.confirmPassword)
                            }
                            helperText={
                                touched.confirmPassword &&
                                errors.confirmPassword
                            }
                            //TODO : Personnalisation graphique à revoir
                            sx={'margin-top:8px;'}
                        />
                        <Divider />
                        <div>
                            <TextField
                                id="lastname"
                                name="lastname"
                                type="text"
                                label="Nom"
                                placeholder="Doe"
                                margin="normal"
                                value={values.lastname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.lastname && Boolean(errors.lastname)
                                }
                                helperText={touched.lastname && errors.lastname}
                            />
                            <TextField
                                id="firstname"
                                name="firstname"
                                type="text"
                                label="Prénom"
                                placeholder="John"
                                margin="normal"
                                value={values.firstname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.firstname &&
                                    Boolean(errors.firstname)
                                }
                                helperText={
                                    touched.firstname && errors.firstname
                                }
                            />
                        </div>
                        <TextField
                            id="number_street"
                            name="number_street"
                            type="number"
                            label="Numéro"
                            placeholder="1"
                            margin="normal"
                            value={values.number_street}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.number_street &&
                                Boolean(errors.number_street)
                            }
                            helperText={
                                touched.number_street && errors.number_street
                            }
                        />
                        <TextField
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
                        <TextField
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
                        <TextField
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
                            helperText={touched.country && errors.country}>
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
                        <TextField
                            id="storage_space"
                            name="storage_space"
                            type="hidden"
                            value={values.storage_space}
                            sx={{overflow: 'hidden'}}
                        />

                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                            //TODO : Personnalisation graphique à revoir
                            sx={'margin-top:8px'}>
                            S&apos;inscrire
                        </Button>
                    </Form>
                )}
            </Formik>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        {'Mot de passe oublié ?'}
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/connect/login" variant="body2">
                        {'Déjà un compte ? Connectez-vous'}
                    </Link>
                </Grid>
            </Grid>
            <AlertSuccess open={openSuccess} setOpen={setOpenSuccess} />
            <AlertFail open={openFailure} setOpen={setOpenFailure} />
        </>
    )
}
export default RegisterForm
