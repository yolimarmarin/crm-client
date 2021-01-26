import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

const NEW_CLIENT = gql`
  mutation newClient($input: ClientInput) {
    newClient(input: $input) {
      name
      lastName
      company
      email
      phone
    }
  }
`;

const GET_CLIENTS_BY_SALESMAN = gql`
  query getClientsBySalesman {
    getClientsBySalesman {
      name
      lastName
      company
      email
    }
  }
`;

const newClient = () => {
  const [message, setMessage] = useState(null);
  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient } }) {
      const { getClientsBySalesman } = cache.readQuery({
        query: GET_CLIENTS_BY_SALESMAN,
      });

      cache.writeQuery({
        query: GET_CLIENTS_BY_SALESMAN,
        data: {
          getClientsBySalesman: [...getClientsBySalesman, newClient],
        },
      });
    },
  });
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required('the field "Name" is required'),
      lastName: Yup.string().required('the field "Last Name" is required'),
      email: Yup.string()
        .email("the email is not valid")
        .required('the field "Email" is required'),
      company: Yup.string().required('the field "Company" is required'),
    }),
    onSubmit: async (values) => {
      const { name, lastName, email, phone, company } = values;
      try {
        await newClient({
          variables: {
            input: {
              name,
              lastName,
              email,
              company,
              phone,
            },
          },
        });
        setMessage({ success: true, text: "Client created succesfully" });
        setTimeout(() => {
          setMessage(null);
          router.push("/");
        }, 3000);
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
      <h1 className="text-2xl text-gray-800 font-light">New Client</h1>
      <div className="flex justify-center mt-5">
        <div class-name="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.name}
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.lastName}
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="company"
              >
                Company
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="company"
                type="text"
                placeholder="Company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.company && formik.errors.company ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.company}
              </div>
            ) : null}

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
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="tel"
                placeholder="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <input
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold"
              type="submit"
              value="Register Client"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default newClient;
