import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      name
      exist
      price
      id
    }
  }
`;

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      name
      price
      exist
    }
  }
`;

const newProduct = () => {
  const [message, setMessage] = useState(null);
  const [newProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct } }) {
      const { getProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });

      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
            getProducts: [...getProducts, newProduct],
        },
      });
    },
  });
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      exist: 0,
      price: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('the field "Name" is required'),
      exist: Yup.number().integer('the field "Exist" can not have decimals')
      .positive('the field "Exist" must be positive').required('the field "Exist" is required'),
      price: Yup.number().positive('the field "Price" must be positive').required('the field "Price" is required'),
    }),
    onSubmit: async (values) => {
      const { name, exist, price } = values;
      try {
        await newProduct({
          variables: {
            input: {
              name,
              exist: parseInt(exist),
              price: parseFloat(price),
              
            },
          },
        });
        setMessage({ success: true, text: "Product created succesfully" });
        setTimeout(() => {
          setMessage(null);
          router.push("/products");
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
      <h1 className="text-2xl text-gray-800 font-light">New Product</h1>
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
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow appereance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="text"
                placeholder="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.price && formik.errors.price ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.price}
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
                value={formik.values.exist}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {formik.touched.exist && formik.errors.exist ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {formik.errors.exist}
              </div>
            ) : null}

            <input
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 font-bold"
              type="submit"
              value="Register Product"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default newProduct;
