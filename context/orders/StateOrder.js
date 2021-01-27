import React, {useReducer} from 'react'
import ContextOrder from './ContextOrder'
import { SELECT_CLIENT, SELECT_PRODUCT, PRODUCT_QUANTITY} from '../../types'
import ReducerOrder from './ReducerOrder'

const StateOrder = ({children}) => {

    const initialState = {
        clients: {},
        product: [],
        total: 0
    }

    const [state, dispatch] = useReducer(ReducerOrder, initialState)

    return (
        <ContextOrder.Provider>
            {children}
        </ContextOrder.Provider>
    )
}

export default StateOrder