import React, {useContext} from "react";
import Layout from "../components/Layout";
import AssignClient from '../components/orders/AssignClient'
import ContextOrder from '../context/orders/ContextOrder'

const newOrder = () => {

    const contextOrder = useContext(ContextOrder)

  return (
    <Layout>
      New Order
      <AssignClient/>
    </Layout>
  );
};

export default newOrder;
