import React from "react";
import Layout from "../components/Layout";
import AssignClient from '../components/orders/AssignClient'

const newOrder = () => {

  return (
    <Layout>
      New Order
      <AssignClient/>
    </Layout>
  );
};

export default newOrder;
