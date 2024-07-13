import { useEffect, useState } from "react";

const useFetchTable = (name,update)=>{
    const [data,setData]=useState([]);
    const [error,setError]=useState(null);
    useEffect(()=>{
        const url=`http://localhost:4000/api/care/${name}`;
        const fetchTable=async()=>{
            try{
                const response = await fetch(url,{
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    //body: JSON.stringify('')
                })
                if(!response.ok)throw new Error('Error to fetch data');
                const jsonData = await response.json();
                setData(jsonData);
                console.log(jsonData);
            }catch(err){
                setError(err.message);
            }
        }
    fetchTable();
    },[update])
    return {data,error};
};

export default useFetchTable;