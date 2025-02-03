"use client"

import { useEffect, useState } from "react"
import { User, columns } from './columns'
import { DataTable } from '@/components/data-table'
import axios from "axios";

type UserType = {
  id: string;
  first_name: string;
  email: string;
};

export default function Page() {
  // const data = await getUsers()

  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  async function getUsers(): Promise<User[]> {
  
    // const res = await fetch(
    //   '@/app/api/users/routes'
    // )
    // const data = await response.json()
    
    const response = await axios.get(`/api/users`,);
    
    if(response.data?.error) {
      setLoading(false);
      console.log(response.data.error)
    } else {
      setLoading(false);
      setAllUsers(response.data?.users);  
    }
    return response?.data?.users
  }


  useEffect(() => {
    getUsers();
  }, [])

  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='mb-6 text-3xl font-bold'>Tous les utilisateurs</h1>
        <DataTable columns={columns} data={allUsers} />
      </div>
    </section>
  )
}