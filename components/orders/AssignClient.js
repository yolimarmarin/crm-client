import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import { gql, useQuery } from "@apollo/client";
import ContextOrder from '../../context/orders/ContextOrder'

const GET_CLIENTS_BY_SALESMAN = gql`
  query getClientsBySalesman {
    getClientsBySalesman {
      name
      lastName
      id
    }
  }
`;


const AssignClient = () =>{

    const [clients, setClients] = useState({})

    const contextOrder = useContext(ContextOrder)
    const { addClient } = contextOrder

    const { data, loading, error } = useQuery(GET_CLIENTS_BY_SALESMAN);

    useEffect(()=>{
      addClient(clients)
    },[clients])
    
    if (loading) return <>Cargando...</>;

    const { getClientsBySalesman } = data

    const selectClients = (clients) =>{
        setClients(clients)
    }

    return(
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1. Assign a client to an order</p>
        <Select
            className="mt-3"
            options={getClientsBySalesman}
            onChange={selectClients}
            getOptionValue={option => option.id}
            getOptionLabel={option => `${option.name} ${option.lastName}`}
            placeholder="Select a client"
            noOptionsMessage={()=>"Not found"}
        />
        </>
    )
}
export default AssignClient