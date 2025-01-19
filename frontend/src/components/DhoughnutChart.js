import '../styles/chart.css'
import { Chart} from "chart.js/auto";
import { useEffect, useRef, useState } from "react";


const DoughnutChart = () => {
    const years=[2021,2022,2023,2024];
    const months=['ALL','JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const chartRef=useRef(null);
    const chartInstance=useRef(null);
    const [values,setValues]=useState([]);
    const [label,setLabel]=useState([]);
    const [year,setYear] = useState('2021');
    const [month,setMonth] = useState('ALL');
    const url=`http://localhost:4000/api/care/piedata`;
    const [piedata,setPiedata]=useState([]);
    const [error,setError]=useState(null);
    const handleselectChange =(event)=>{
        if(event.target.childElementCount===13) setMonth(event.target.value);
        else setYear(event.target.value);
    }

    useEffect(()=>{
        const fetchData = async () => {
          try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({year:year,month:month})
                }
            );
            if (!response.ok) throw new Error('Failed to fetch data');
            const jsonData = await response.json();
            setPiedata(jsonData);
            setError(null);
          }catch(err){
            console.error('Error fetching data : ',err);
            setError(err.message);
          }
        };
        fetchData();
      },[month,year]);

    useEffect(()=>{
        if(!error && Array.isArray(piedata.slicedata)){ 
            const PieLabel=piedata.slicedata.map(pie=>{return Object.keys(pie)[0]});
            const PieData=piedata.slicedata.map(pie=>{return Object.values(pie)[0]});
            setLabel(PieLabel);
            setValues(PieData);
        }
    },[error,piedata])

    useEffect(()=>{
        if(chartInstance.current){
            chartInstance.current.destroy();
        }
        const mychartRef = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(mychartRef,{
            type: 'doughnut',
            data: {
                labels: label,
                datasets:[{
                    data:values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                      ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                    ],
                }],
           },
           options:{
                responsive: true,
                maintainAspectRatio: false,
           }
        });
        return()=>{
            if(chartInstance.current){
                chartInstance.current.destroy();
            }
        }
    },[label,values])
    return ( 
        <div className="piechart-container">
            <div className='option-container'>
            <span>Year</span>
                <div className='option1'>
                    <select className="select" value={year} onChange={handleselectChange}>
                        {years.map((year,key)=>{return <option key={key} >{year}</option>})}
                    </select>
                </div>
                <span>Month</span>
                <div className='option2'>
                    <select className="select" value={month} onChange={handleselectChange}>
                        {months.map((month,key)=>{return <option key={key}>{month}</option>})}
                    </select>
                </div>
            </div>
            <hr className='bar'/>
            <canvas ref={chartRef}/>
        </div>
     );
}
 
export default DoughnutChart;