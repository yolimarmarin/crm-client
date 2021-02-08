import React, {useContext} from 'react'
import ContextOrder from '../../context/orders/ContextOrder'

const Total = () => {

    const contextOrder = useContext(ContextOrder)
    const { total } = contextOrder

    return (
    <div className="flex items-center mt-5 justify-between bg-white p-3">
        <h2 className="text-gray-800 text-lg">Total:</h2>
        <p className="text-gray-800 mt-0">$ {total}</p>
    </div>
    )
}

export default Total