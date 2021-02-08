import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Product from "../components/Product";

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      name
      price
      exist
      id
    }
  }
`;

const Home = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return "loading...";

  if (!data.getProducts) {
    return router.push("/login");
  }

  return loading ? (
    <>loading</>
  ) : (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Products</h1>
        <Link href="/newProduct">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            New Product
          </a>
        </Link>
        
        <div className='overflow-x-scroll'>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Name</th>
              <th className="w-1/5 py-2">Price</th>
              <th className="w-1/5 py-2">Exist</th>
              <th className="w-1/5 py-2">Edit</th>
              <th className="w-1/5 py-2">Delete</th>
            </tr> 
          </thead>
          <tbody className="bg-white">
            {data.getProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </tbody>
        </table>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
