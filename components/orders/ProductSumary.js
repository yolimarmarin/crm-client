import React, { useContext, useState, useEffect } from 'react'
import ContextOrder from '../../context/orders/ContextOrder'

const ProductSumary = ({ product} ) => {

    const { name, price, id } = product
    const [quantity, setQuantity] = useState(0)
    const contextOrder = useContext(ContextOrder)
    const { productQuantity, updateTotal } = contextOrder

    const updateQuantity = () => {
        const newProduct = {...product, quantity: Number(quantity)}
        productQuantity(newProduct)

    }

    useEffect(()=>{
        updateQuantity()
        updateTotal()
    },[quantity])


    return (
    <div className="md:flex md:justify-between md:items-center mt-5">
        <div className="md:w-2/4 mb-2 md:mb:0">
            <p className="text-sm">{name}</p>
            <p>$ {price}</p>
        </div>
        <input 
            type="number"
            placeholder="Quantity"
            className="shadow apperance-none border rounded w-full py-2 px-3 text-grey-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
        />

    </div>
    )
}

export default ProductSumary