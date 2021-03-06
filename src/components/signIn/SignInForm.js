import React, { useState, useEffect } from "react";
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import signInSchema from "./signInSchema";

const initialFormValues = {
    username: '',
    password: ''
}

const initialFormErrors = {
    username: '',
    password: ''
}
const initialUsers = []
const initialDisabled = true

const SignInForm = () => {

    const [users, setUsers] = useState(initialUsers)
    const [formValues, setFormValues] = useState(initialFormValues)
    const [formErrors, setFormErrors] = useState(initialFormErrors)
    const [disabled, setDisabled] = useState(initialDisabled)
    let history = useHistory()

    const postNewUsers = newUser => {
        axios.post('', newUser)
            .then(response => {
                setUsers([...users, response.data])
                localStorage.setItem("token", response.data.token);
                console.log('signIn successful', response.data)
                history.push('/dashboard');
            })
            .catch((error) => {
                // debugger
                console.log(error);
            })
            .finally(() => {
                setFormValues(initialFormValues);
            });
    };
    const validate = (name, value) => {
        //yup validation schema
        yup
            .reach(signInSchema, name)
            .validate(value)
            .then((valid) => {
                setFormErrors({
                    ...formErrors,
                    [name]: "",
                });
            })
            .catch((error) => {
                setFormErrors({
                    ...formErrors,
                    [name]: error.errors[0],
                });
            });
    };

    const onChange = (event) => {
        const { name, value } = event.target;
        change(name, value);
    };

    const change = (name, value) => {
        validate(name, value);
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const onSubmit = event => {
        event.preventDefault()
        submit()
        // change route to home page, dashboard
    }

    const submit = () => {
        const newUser = {
            username: formValues.username.trim(),
            password: formValues.password.trim()
        }
        postNewUsers(newUser)
    }

    useEffect(() => {
        signInSchema.isValid(formValues).then((valid) => {
            setDisabled(!valid);
        });
    }, [formValues]);

    return (
        <div>
            <form className='form2' onSubmit={onSubmit}>
                <h1>SignIn</h1>

                <div>
                    <div>{formErrors.username}</div>
                    <div>{formErrors.password}</div>
                </div>

                <div className="username2">
                    <label>Username:     </label>
                    <input
                        value={formValues.username}
                        onChange={onChange}
                        name='username'
                        type='username'
                    />
                </div>

                <div className="password2">
                    <label>Password:     </label>
                    <input
                        value={formValues.password}
                        onChange={onChange}
                        autoComplete='true'
                        suggested="current-password"
                        name='password'
                        type='password'
                    />
                </div>

                <button disabled={disabled} id='button2'>Submit</button>

                {/* new users click here, or something else, need to sign up? */}
                <div className='sign-in-link'>
                    <Link to='/register'>Not a member? Register here.</Link>
                </div>
            </form>
        </div>
    );
};

export default SignInForm;
