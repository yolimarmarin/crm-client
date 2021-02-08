import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AssignClient from '../components/orders/AssignClient'
import AssignProducts from '../components/orders/AssignProducts'
import OrderSumary from '../components/orders/OrderSumary'
import Total from "../components/orders/Total";
import ContextOrder from '../context/orders/ContextOrder'
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

const GET_ORDERS_BY_SALESMAN = gql`
  query getOrdersBySalesman {
    getOrdersBySalesman {
      id
      order {
        id
        quantity
        name
      }
      client {
        id
        name
        lastName
        email
        phone
      }
      salesman
      total
      state
    }
  }
`;

const newOrder = () => {

  const router = useRouter()
    const [message, setMessage] = useState(null)
    const [newOrder] = useMutation(NEW_ORDER, {
      update(cache, {data: {newOrder}}) {
        const { getOrdersBySalesman } = cache.readQuery({
          query: GET_ORDERS_BY_SALESMAN,
        });
  
        cache.writeQuery({
          query: GET_ORDERS_BY_SALESMAN,
          data: {
            getOrdersBySalesman: [...getOrdersBySalesman, newOrder],
          },
        });
      },
    });

    const contextOrder = useContext(ContextOrder)
    const { client, products, total } = contextOrder

    const validateOrder = () =>{
      if( !products.every((product)=> product.quantity > 0) || total === 0 || !client){
        return 'opacity-50 cursor-not-allow'
      }
      return ''
    }

    const createNewOrder = async () =>{

      const order = products.map(({ exist, __typename, ...rest}) => rest)
      
      try {
        const { data } = await newOrder({
          variables: {
            input: {
              client: client.id,
              total,
              order
            }
          }
        })
        router.push('/orders');
        Swal.fire('Correct', 'Order registered successfully', 'success')

      } catch (error) {
        setMessage(error.message.replace('GraphQL error:',''))

        setTimeout(() => {
          setMessage(null)
        }, 3000);
      }

    }

    const displayMessage = () => {
      return (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p>{message}</p>
        </div>
      )
    }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">New Order</h1>
      
      {message && displayMessage()}
      
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AssignClient/>
          <AssignProducts/>
          <OrderSumary/>
          <Total/>
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
            onClick={createNewOrder}
         >
            Register order
          </button>
        </div>
      </div>  
    </Layout>
  );
};

export default newOrder;
