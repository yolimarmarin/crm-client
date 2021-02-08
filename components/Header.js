import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const GET_USER = gql`
  query {
    getUser {
      id
      name
      lastName
    }
  }
`;

const Header = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USER);
  if (loading) return null;

  if(!data){
      return router.push('/login')
  }
  const { name } = data.getUser;

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="sm:flex justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">Hi: {name}</p>
      <button
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md lg:w-auto text-center"
        onClick={() => logOut()}
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
