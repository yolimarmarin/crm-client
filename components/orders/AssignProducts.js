import React, {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import { gql, useQuery } from "@apollo/client";
import ContextOrder from '../../context/orders/ContextOrder'

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      name
      price
      exist
      id
    }
  }
`;


const AssignProducts = () =>{

    const [products, setProducts] = useState([])

    const contextOrder = useContext(ContextOrder)
    const { addProducts } = contextOrder

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    useEffect(()=>{
        addProducts(products)
      },[products])
    
    if (loading) return <>loading...</>;

    const { getProducts } = data

    const selectProducts = (products) =>{
        setProducts(products)
    }

    return(
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2. Assign products to an order</p>
        <Select
            className="mt-3"
            options={getProducts}
            onChange={selectProducts}
            getOptionValue={option => option.id}
            getOptionLabel={option => `${option.name} - ${option.exist} Available`}
            placeholder="Select a product"
            noOptionsMessage={()=>"Not found"}
            isMulti={true}
        />
        </>
    )
}
export default AssignProducts