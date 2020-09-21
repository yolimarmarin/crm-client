import React,{ useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useMutation, gql } from "@apollo/client";

const AUTH_USER = gql`
  mutation authUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

const Login = () => {

  const [message, setMessage] = useState(null);
  const [authUser] = useMutation(AUTH_USER);
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("the email is not valid")
        .required('the field "Email" is required'),
      password: Yup.string().required('the field "Password" is required'),
    }),
    onSubmit: async (values) => {
      const {email, password } = values;
      try {
         const {data} = await authUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        const {token} = data.authUser
        localStorage.setItem('token',token)
          router.push('/')

      } catch (error) {
        setMessage({ success: false, text: error.message });
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  return (
    <Layout>
      {message ? (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          {message.text}
        </div>
      ) : null}
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-t">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.email}
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.password}
              </div>
            ) : null}

            <input
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              type="submit"
              value="Login"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
