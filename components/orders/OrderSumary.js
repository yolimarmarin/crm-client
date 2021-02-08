import React, {useContext} from 'react'
import ContextOrder from '../../context/orders/ContextOrder'
import ProductSumary from './ProductSumary'

const OrderSumary = () => {

    const contextOrder = useContext(ContextOrder)
    const { products } = contextOrder

    return(
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3. Select products quantities</p>
        {
            products.length > 0 ? 
            <>{products.map((product)=><ProductSumary product={product} key={product.id}/>)}</> :
            <p className="mt-5 text-sm">You haven't selected any products</p>
        }
        
        </>
    )
}

export default OrderSumary