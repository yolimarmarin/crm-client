import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const GET_CLIENT_BY_ID = gql`
  query getClientById($id: ID!) {
    getClientById(id: $id) {
      name
      lastName
      company
      email
      phone
    }
  }
`;

const UPDATE_CLIENT_BY_ID = gql`
    mutation updateClientById($id: ID!, $input: ClientInput){
        updateClientById(id:$id, input:$input){
            name
            email
        }
    }
`

const editClient = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(GET_CLIENT_BY_ID, {
    variables: { id },
  });

  const [updateClientById] = useMutation(UPDATE_CLIENT_BY_ID)

  const validationSchema = Yup.object({
    name: Yup.string().required('the field "Name" is required'),
    lastName: Yup.string().required('the field "Last Name" is required'),
    email: Yup.string()
      .email("the email is not valid")
      .required('the field "Email" is required'),
    company: Yup.string().required('the field "Company" is required'),
  });

  if (loading) return "loading...";

  const { getClientById } = data;

  const updateData = async (values) => {
    const {name, lastName, email, company, phone} = values

    try {
        const {data} = await updateClientById({variables:{
            id,
            input:{
                name,
                lastName,
                email,
                company,
                phone
            }
        }})
        Swal.fire("Updated", 'client succesfully updated', "success");
        router.push('/')
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Edit Client</h1>
      <div className="flex justify-center mt-5">
        <div class-name="w-full max-w-lg">
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getClientById}
            onSubmit={(values)=>updateData(values)}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
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
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.name && props.errors.name ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.name}
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
                      value={props.values.lastName}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.lastName && props.errors.lastName ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.lastName}
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
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.company && props.errors.company ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.company}
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
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.email}
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
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  <input
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold"
                    type="submit"
                    value="Edit Client"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default editClient;
