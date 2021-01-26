import React from "react";
import Swal from "sweetalert2";
import { useMutation, gql } from "@apollo/client";
import Router from "next/router";

const DELETE_CLIENT_BY_ID = gql`
  mutation deleteClientById($id: ID!) {
    deleteClientById(id: $id)
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

const Client = ({ client }) => {
  const { name, lastName, company, email, id } = client;

  const [deleteClientById] = useMutation(DELETE_CLIENT_BY_ID, {
    update(cache) {
      const { getClientsBySalesman } = cache.readQuery({
        query: GET_CLIENTS_BY_SALESMAN,
      });

      cache.writeQuery({
        query: GET_CLIENTS_BY_SALESMAN,
        data: {
          getClientsBySalesman: getClientsBySalesman.filter(
            (currentClient) => currentClient.id !== id
          ),
        },
      });
    },
  });

  const confirmDeleteClient = () => {
    Swal.fire({
      title: `Are you sure you want to delete the client?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await deleteClientById({
            variables: {
              id,
            },
          });
          Swal.fire("Deleted!", data.deleteClientById, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editClient = () => {
    Router.push({
      pathname: "/editClient/[id]",
      query: { id },
    });
    console.log(`edit ${id}`);
  };

  return (
    <tr key={client.id}>
      <td className="border px-4 py-2">
        {name} {lastName}
      </td>
      <td className="border px-4 py-2">{company}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => editClient()}
        >
          Edit
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmDeleteClient(id, name)}
        >
          Delete
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
      </td>
    </tr>
  );
};

export default Client;
