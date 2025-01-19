import { useEffect, useState , useMemo} from "react";

const useFetchTable = (name, update, query)=>{
    const [data,setData]=useState([]);
    const [error,setError]=useState(null);
    const memoizedQuery = useMemo(() => query, [JSON.stringify(query)]);
    console.log(memoizedQuery);
    useEffect(()=>{
        const url=`http://localhost:4000/api/care/${name}`;
        const fetchTable=async()=>{
            try{
                const response = await fetch(url,{
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(memoizedQuery)
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
    },[name,memoizedQuery,update])
    return {data,error};
};

export default useFetchTable;