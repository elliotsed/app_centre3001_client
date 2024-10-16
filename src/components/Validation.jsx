export default function Validation(values) {
    let errors = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (values?.name) {
        if (values.name === "") {
            errors.name = "Ce champ est requis"
        } else if (values.name.length < 3 || values.name.length > 30) {
            errors.name = "Le nom doit contenir entre 3 et 30 caractères"
        } else {
            errors.name = ""
        }
    }

    if (values.email === "") {
        errors.email = "Ce champ est requis"
    } else if (!email_pattern.test(values.email)) {
        errors.email = "L'email n'est pas valide!"
    } else {
        errors.email = ""
    }

    if (values.password === "") {
        errors.password = "Ce champ est requis"
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Le mot de passe doit contenir au minimum 8 caractères dont un minuscule, un majuscule et un nombre"
    } else {
        errors.password = ""
    }

    if (values?.password_confirm) {
        if (values.password_confirm === "") {
            errors.password_confirm = "Ce champ est requis"
        } else if (values.password !== values.password_confirm) {
            errors.password_confirm = "Les mots de passe ne sont pas identiques"
        } else {
            errors.password_confirm = ""
        }
    }
    return errors;
}