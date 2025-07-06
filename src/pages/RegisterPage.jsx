import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ConfirmSchema,
    getErrors,
    getFieldError,
} from '../lib/validationForm';
import { supabase } from "../supabase/supabase-client";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [formState, setFormState] = useState({
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("Submit intercettato!");
        setFormSubmitted(true);
        const { error, data } = ConfirmSchema.safeParse(formState);
        if (error) {
            const errors = getErrors(error);
            setFormErrors(errors);
            return;
        } else {
            console.log("Validazione OK, dati:", data);
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        username: data.username,
                    },
                },
            });

            if (error) {
                console.log("Errore registrazione Supabase:", error);
                alert("Errore durante la registrazione 👎🏻");
            } else {
                console.log("Registrazione Supabase completata");
                alert("Registrazione completata 👍🏻");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                navigate("/");
            }
        }
    };

    const onBlur = (property) => () => {
        const message = getFieldError(property, formState[property]);
        setFormErrors((prev) => ({ ...prev, [property]: message }));
        setTouchedFields((prev) => ({ ...prev, [property]: true }));
    };

    const isInvalid = (property) => {
        if (formSubmitted || touchedFields[property]) {
            return !!formErrors[property];
        }
        return undefined;
    };

    const setField = (property, valueSelector) => (e) => {
        setFormState((prev) => ({
            ...prev,
            [property]: valueSelector ? valueSelector(e) : e.target.value,
        }));
    };

    return (
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-2xl shadow-md" style={{ marginTop: 100 }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Crea il tuo account</h2>
            <form onSubmit={onSubmit} noValidate className="space-y-5">

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={setField("email")}
                        onBlur={onBlur("email")}
                        aria-invalid={isInvalid("email")}
                        required
                        className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.email ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {formErrors.email && (
                        <small className="text-red-500">{formErrors.email}</small>
                    )}
                </div>

                {/* Nome */}
                <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium">Nome</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formState.firstName}
                        onChange={setField("firstName")}
                        onBlur={onBlur("firstName")}
                        aria-invalid={isInvalid("firstName")}
                        required
                        className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {formErrors.firstName && (
                        <small className="text-red-500">{formErrors.firstName}</small>
                    )}
                </div>

                {/* Cognome */}
                <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium">Cognome</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formState.lastName}
                        onChange={setField("lastName")}
                        onBlur={onBlur("lastName")}
                        aria-invalid={isInvalid("lastName")}
                        required
                        className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.lastName ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {formErrors.lastName && (
                        <small className="text-red-500">{formErrors.lastName}</small>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formState.username}
                        onChange={setField("username")}
                        onBlur={onBlur("username")}
                        aria-invalid={isInvalid("username")}
                        required
                        className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.username ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {formErrors.username && (
                        <small className="text-red-500">{formErrors.username}</small>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formState.password}
                        onChange={setField("password")}
                        onBlur={onBlur("password")}
                        aria-invalid={isInvalid("password")}
                        required
                        className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.password ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {formErrors.password && (
                        <small className="text-red-500">{formErrors.password}</small>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        Registrati
                    </button>
                </div>
            </form>
        </div>

    );
}
