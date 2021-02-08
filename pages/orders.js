import Layout from "../components/Layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Order from "../components/Order";

const GET_ORDERS_BY_SALESMAN = gql`
  query getOrdersBySalesman {
    getOrdersBySalesman {
      id
      order {
        id
        quantity
        name
      }
      client {
        id
        name
        lastName
        email
        phone
      }
      salesman
      total
      state
    }
  }
`;

const Orders = () => {

  const { data, loading, error } = useQuery(GET_ORDERS_BY_SALESMAN);

  if (loading) return "loading...";

  const { getOrdersBySalesman } = data

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Orders</h1>
        <Link href="/newOrder">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            New Order
          </a>
        </Link>

        { getOrdersBySalesman.length === 0 ? (
          <p className='mt-5 text-center text-2xl'>There are no orders</p>
        ) : (
          getOrdersBySalesman.map((order)=><Order order={order} key={order.id}/>)
        ) }

      </Layout>
    </div>
  );
};

export default Orders;
