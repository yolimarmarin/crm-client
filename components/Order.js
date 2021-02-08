import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";

const UPDATE_ORDER_BY_ID = gql`
  mutation updateOrderById($id: ID!, $input: OrderInput) {
    updateOrderById(id: $id, input: $input) {
      state
    }
  }
`;

const DELETE_ORDER_BY_ID = gql`
  mutation deleteOrderById($id: ID!) {
    deleteOrderById(id: $id)
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

const Order = ({ order }) => {
  const {
    id,
    total,
    client: { name, lastName, email, phone },
    state,
  } = order;

  const [orderState, setOrderState] = useState(state);
  const [orderClass, setOrderClass] = useState("");

  const [updateOrderById] = useMutation(UPDATE_ORDER_BY_ID);

  const [deleteOrderById] = useMutation(DELETE_ORDER_BY_ID, {
    update(cache) {
      const { getOrdersBySalesman } = cache.readQuery({
        query: GET_ORDERS_BY_SALESMAN,
      });

      cache.writeQuery({
        query: GET_ORDERS_BY_SALESMAN,
        data: {
          getOrdersBySalesman: getOrdersBySalesman.filter(
            (currentOrder) => currentOrder.id !== id
          ),
        },
      });
    },
  });

  useEffect(() => {
    if (orderState) {
      setOrderState(orderState);
    }
    updateOrderClass();
  }, [orderState]);

  const updateOrderClass = () => {
    switch (orderState) {
      case "pending":
        setOrderClass("border-yellow-500");
        break;
      case "completed":
        setOrderClass("border-green-500");
        break;
      default:
        setOrderClass("border-red-800");
        break;
    }
  };

  const updateOrderState = async (newState) => {
    console.log(newState, order.client.id);
    try {
      const { data } = await updateOrderById({
        variables: {
          id,
          input: {
            state: newState,
            client: order.client.id,
          },
        },
      });
      setOrderState(data.updateOrderById.state);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDeleteOrder = () => {
    Swal.fire({
      title: `Are you sure you want to delete the order?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await deleteOrderById({
            variables: {
              id,
            },
          });
          Swal.fire("Deleted!", data.deleteOrderById, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={`${orderClass} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
    >
      <div className="">
        <p className="font-bold text-gray-800">
          Client: {name} {lastName}
        </p>

        {email && (
          <p className="flex items-center mt-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            {email}
          </p>
        )}

        {phone && (
          <p className="flex items-center mt-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            {phone}
          </p>
        )}

        <h2 className="text-gray-800 font-bold mt-10">Order State:</h2>
        <select
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-sm font-bold"
          value={orderState}
          onChange={(e) => updateOrderState(e.target.value)}
        >
          <option value="completed">COMPLETED</option>
          <option value="pending">PENDING</option>
          <option value="canceled">CANCELED</option>
        </select>
      </div>
      <div className="">
        <h2 className="text-gray-800 font-bold mt-2">Order Sumary:</h2>
        {order.order.map((item) => (
          <div key={item.id} className="mt-4">
            <p className="text-sm text-gray-600">Product: {item.name}</p>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          </div>
        ))}

        <p className="text-gray-800 mt-3 font-bold">
          Total:
          <span className="font-light"> $ {total}</span>
        </p>

        <button
          className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"
          onClick={() => confirmDeleteOrder(id)}
        >
          Delete Order
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Order;
