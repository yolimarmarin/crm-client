import React, {useReducer} from 'react'
import ContextOrder from './ContextOrder'
import { SELECT_CLIENT, SELECT_PRODUCT, PRODUCT_QUANTITY, UPDATE_TOTAL } from '../../types'
import ReducerOrder from './ReducerOrder'

const StateOrder = ({children}) => {

    const initialState = {
        client: {},
        products: [],
        total: 0
    }

    const [state, dispatch] = useReducer(ReducerOrder, initialState)

    const addClient = (client) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client 
        })
    }

    const addProducts = (products) => {

        let newState 
        if(state.products.length > 0) {

            newState = products.map((product)=>{
                const newObject = state.products.find( stateProduct => stateProduct.id === product.id)
                return {...product, ...newObject}
            })

        } else {
            newState = products
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        })
    }

    const productQuantity = (newProduct) => {
        dispatch({
            type: PRODUCT_QUANTITY,
            payload: newProduct
        })
    }

    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL
        })
    }
    
    return (
        <ContextOrder.Provider value={{
            products: state.products,
            total: state.total,
            client: state.client,
            addClient,
            addProducts,
            productQuantity,
            updateTotal
        }}>
            {children}
        </ContextOrder.Provider>
    )
}

export default StateOrder