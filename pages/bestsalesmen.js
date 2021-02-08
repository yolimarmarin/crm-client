import React, {useEffect} from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { gql, useQuery } from "@apollo/client";

const BestSalesmen = () => {

  const GET_TOP_SALESMEN = gql`
    query getTopSalesmen {
      getTopSalesmen {
        total
        salesman {
            name
        }
      }
    }
  `;

  const { data, loading, startPolling, stopPolling } = useQuery(GET_TOP_SALESMEN); 
  
  useEffect(() => {
    startPolling(1000);
    return () => {
        stopPolling()
    }
  },[startPolling, stopPolling])
  
  if (loading) return "loading...";

  const { getTopSalesmen } = data;

  const graphData = []

  getTopSalesmen.map((salesman,index)=>{
    graphData[index] = {
        ...salesman.salesman[0],
        total: salesman.total
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Best Salesmen</h1>
      <ResponsiveContainer width="99%" height={550}>
      <BarChart
        className="mt-10"
        width={600}
        height={500}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#3183ce" />
      </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default BestSalesmen;
