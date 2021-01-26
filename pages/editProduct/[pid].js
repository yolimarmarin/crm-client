import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const GET_PRODUCT_BY_ID = gql`
  query getProductById($id: ID!) {
    getProductById(id: $id) {
      name
      price
      exist
    }
  }
`;

const UPDATE_PRODUCT_BY_ID = gql`
    mutation updateProductById($id: ID!, $input: ProductInput){
        updateProductById(id:$id, input:$input){
            name
            price
            exist
        }
    }
`

const editClient = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
  });

  const [updateProductById] = useMutation(UPDATE_PRODUCT_BY_ID)

  const validationSchema = Yup.object({
    name: Yup.string().required('the field "Name" is required'),
    exist: Yup.number().integer('the field "Exist" can not have decimals')
    .positive('the field "Exist" must be positive').required('the field "Exist" is required'),
    price: Yup.number().positive('the field "Price" must be positive').required('the field "Price" is required'),
  });

  if (loading) return "loading...";

  const { getProductById } = data;

  const updateData = async (values) => {
    const {name, price, exist} = values

    try {
        const {data} = await updateProductById({variables:{
            id,
            input:{
                name,
                exist: parseInt(exist),
                price: parseFloat(price),
            }
        }})
        Swal.fire("Updated", 'product succesfully updated', "success");
        router.push('/products')
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Edit Product</h1>
      <div className="flex justify-center mt-5">
        <div class-name="w-full max-w-lg">
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getProductById}
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
                      htmlFor="price"
                    >
                      Price
                    </label>
                    <input
                      className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="price"
                      type="text"
                      placeholder="Price"
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.price && props.errors.price ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.price}
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="exist"
                    >
                      Exist
                    </label>
                    <input
                      className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="exist"
                      type="text"
                      placeholder="Exist"
                      value={props.values.exist}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {props.touched.exist && props.errors.exist ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {props.errors.exist}
                    </div>
                  ) : null}

                  <input
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold"
                    type="submit"
                    value="Edit Product"
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
