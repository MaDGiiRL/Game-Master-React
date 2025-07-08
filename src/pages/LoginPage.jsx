import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConfirmSchemaLogin,
  getErrors,
  getFieldError,
} from '../lib/validationForm';
import { supabase } from "../supabase/supabase-client";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const { error, data } = ConfirmSchemaLogin.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      return;
    }

    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (supabaseError) {
      console.error("Errore login Supabase:", supabaseError.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Email o password non corretti. 👎🏻',
        confirmButtonColor: '#d33',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Benvenuto!',
        text: 'Login effettuato con successo 🎉',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 1600);
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
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-2xl shadow-md" style={{ marginTop: 200 }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Accedi al tuo account</h2>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
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
            className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {formErrors.email && (
            <small className="text-red-500">{formErrors.email}</small>
          )}
        </div>

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
            className={`w-full px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 ${formErrors.password ? "border-red-500" : "border-gray-300"}`}
          />
          {formErrors.password && (
            <small className="text-red-500">{formErrors.password}</small>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Accedi
          </button>
        </div>
      </form>
    </div>
  );
}
