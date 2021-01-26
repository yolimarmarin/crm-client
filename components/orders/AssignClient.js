import React, {useState, useEffect} from 'react'
import Select from 'react-select'

const options = [
    {id:1, name:'matt'},
    {id:2, name:'juan'}
]


const AssignClient = () =>{

    const [clients, setClients] = useState([])

    useEffect(()=>{
        console.log(clients)
    },[clients])

    const selectClients = (clients) =>{
        setClients(clients)
    }

    return(
        <Select
            options={options}
            isMulti={true}
            onChange={selectClients}
            getOptionValue={option => option.id}
            getOptionLabel={option => option.name}
            placeholder="Select a client"
            noOptionsMessage={()=>"Not found"}
        />
    )
}
export default AssignClient