import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {Button, TextField} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import {useMutation} from '@tanstack/react-query'
import {Form, Formik} from 'formik'
import {useState} from 'react'
import {fetchLogin} from '../utils/fetch'
import {loginSchema} from '../validation/validation'
import AlertFail from './notification/alerts/AlertFail'
import AlertSuccess from './notification/alerts/AlertSuccess'
import Box from "@mui/material/Box";


function LoginForm() {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailure, setOpenFailure] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const successAlertMessage = 'Connexion réussie. Redirection...'
    const failAlertMessage = 'Connexion échouée. Veuillez réessayer.'

    const {mutate} = useMutation({
        mutationKey: ['login'],
        mutationFn: (variables) => fetchLogin(variables),
        onSuccess: (data) => {
            localStorage.setItem('BBStorage_token', data.token)
            setOpenSuccess(true)
        },
        onError: (error) => {
            setErrorMessage(error)
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
                Connexion
            </Typography>

            <Formik
                initialValues={{email: '', password: ''}}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={loginSchema}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 2, mb: 2}}
                        >
                            Se connecter
                        </Button>
                    </Box>
                )}
            </Formik>

            <Grid container sx={{mt: 2, px: 4}}>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        {'Mot de passe oublié ?'}
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/register" variant="body2">
                        {'Pas de compte ? Inscrivez-vous'}
                    </Link>
                </Grid>
            </Grid>

            <AlertSuccess open={openSuccess} setOpen={setOpenSuccess} type="login" message={successAlertMessage}/>
            <AlertFail open={openFailure} setOpen={setOpenFailure} error={errorMessage} message={failAlertMessage}/>
        </Box>

    )
}

export default LoginForm
