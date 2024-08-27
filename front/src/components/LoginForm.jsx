import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import {Formik, Form} from 'formik'
import {loginSchema} from '../validation/validation'
import {TextField, Button} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {fetchLogin} from '../utils/fetch'
import {useState} from 'react'
import AlertSuccess from './notification/alerts/AlertSuccess'
import AlertFail from './notification/alerts/AlertFail'
import {useLocation} from 'react-router-dom'

function LoginForm() {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openFailure, setOpenFailure] = useState(false)
    const location = useLocation()
    console.log(location.state)

    const {mutate} = useMutation({
        mutationKey: ['login'],
        mutationFn: (variables) => fetchLogin(variables),
        onSuccess: (data) => {
            localStorage.setItem('BBStorage_token', data.token)
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
        <>
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Connexion
            </Typography>

            <Formik
                initialValues={{email: '', password: ''}}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={loginSchema}
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
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit">
                            Se connecter
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
                    <Link href="/connect/register" variant="body2">
                        {'Pas de compte ? Inscrivez-vous'}
                    </Link>
                </Grid>
            </Grid>
            <AlertSuccess open={openSuccess} setOpen={setOpenSuccess} />
            <AlertFail open={openFailure} setOpen={setOpenFailure} />
        </>
    )
}

export default LoginForm
