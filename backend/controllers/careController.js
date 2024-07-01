const oracledb = require('oracledb')
const {getDaysInMonth, ReversemonthMap, monthMap}  = require('../monthTonum')
const {runQuery,runQueryOutBinds}=require('../connection')


const pieData = async(req, res)=>{
    try{
        let count =[];
        let d=[];
        const {year,month} = req.body;
        console.log(req.body);
        if(!month || month=="ALL"){
            d[0] = await runQuery(
            `select count(c.SERVICE_ID) AS "Only Basic"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Basic'`,{year});

            d[1] = await runQuery(
            `select count(c.SERVICE_ID) AS "Basic & Premium"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Premium'`,{year});

            d[2] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Repair"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.REPAIR.type is not null`,{year});

            d[3] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Wash"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.WASH.type is not null`,{year});   
            
            for(let i=0;i<4;++i)count.push(d[i][0]);
        }
        else{
            d[0] = await runQuery(
            `select count(c.SERVICE_ID) AS "Only Basic"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Basic'`,{month,year});
    
            d[1] = await runQuery(
            `select count(c.SERVICE_ID) AS "Basic & Premium"
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            l.MAINTENANCE_CATEGORY='Premium'`,{month,year});
    
            d[2] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Repair"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.REPAIR.type is not null`,{month,year});
    
            d[3] = await runQuery(
            `select count(c.SERVICE_ID) AS "Vehicle Wash"
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            to_char(t.SERVICE_DATE,'MON')=:month AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
            s.WASH.type is not null`,{month,year});   
                
            for(let i=0;i<4;++i)count.push(d[i][0]);
        }
        res.status(200).json({
            "slicedata": count
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Error quering the Piedata');
    }
}


const lineData = async(req,res)=>{
    try{
        const {year,month} = req.body;
        let months=[];
        let days=[];
        if(month=="ALL" || !month){
            for(let mon=1;mon<=12;++mon){
                const data=await runQuery(
                `SELECT SUM(c.SERVICING_COST) AS "${ReversemonthMap[mon]}"
                FROM CARE_TRANSAC c,TAKES_CARE t WHERE 
                EXTRACT(MONTH FROM t.SERVICE_DATE)=:mon AND 
                EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND
                c.SERVICE_ID=t.SERVICE_ID`,{mon,year});
                if(data[0][ReversemonthMap[mon]]!==null) months.push(data[0]);
                else months.push({[ReversemonthMap[mon]]: 0});  
            }
            res.status(200).json({
                "monthCost": months
            }); 
        }
        else{
            const total=getDaysInMonth(monthMap[month], year);
            for(let day=1;day<=total;++day){
                const data=await runQuery(
                `SELECT SUM(c.SERVICING_COST) AS "Day ${day}"
                FROM CARE_TRANSAC c,TAKES_CARE t WHERE 
                EXTRACT(DAY FROM t.SERVICE_DATE)=:day AND
                to_char(t.SERVICE_DATE,'MON')=:month AND 
                EXTRACT(YEAR FROM t.SERVICE_DATE)=:year AND 
                c.SERVICE_ID=t.SERVICE_ID`,{day,month,year});
                if(data[0][`Day ${day}`]!==null) days.push(data[0]);
                else days.push({[`Day ${day}`]:0});  
            }
            res.status(200).json({
                "dayCost": days
            }); 
        }
    }catch(err){
        console.error(err);
        res.status(500).send('Error quering the Line data');
    }
}

const shortUser = async(req,res)=>{
    let {
        vehicleno,
        vehicleowner,
        vehicletype,
        vehiclemodel,
        vehiclecompany,
        vehiclecolor,
        date,
        repairtype,
        washtype}=req.body;

        vehicleno = vehicleno.toUpperCase();
        vehicletype = vehicletype.toUpperCase();
        vehiclecompany = vehiclecompany.toUpperCase();
        vehiclemodel = vehiclemodel.toUpperCase();
        vehiclecolor = vehiclecolor.toUpperCase();
    try{
        const exists=await runQuery(
        `select * from vehicle_info 
        where VEHICLENO = :vehicleno`,{vehicleno});

        if(exists.length===0){
            await runQuery(`insert into vehicle_info (VEHICLENO, VEHICLE_OWNER, VEHICLETYPE, VEHICLE_MODEL, VEHICLE_COMPANY, VEHICLE_COLOR)
            values(:vehicleno,:vehicleowner,:vehicletype,:vehiclemodel,:vehiclecompany,:vehiclecolor)`,
            {   vehicleno,
                vehicleowner,
                vehicletype,
                vehiclemodel,
                vehiclecompany,
                vehiclecolor,
            });
            console.log('Successful Insertion in vehicle info!!');
        }else{
            console.log('Already exists!!');
        }

        const data=await runQueryOutBinds(`insert into care_transac(MECHANIC_NAME,SERVICE_TYPE,SERVICING_COST)
        values('Not Selected','shortterm',0)
        returning SERVICE_ID INTO :service_id`,
        {
                service_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        });
        console.log('Successful Insertion in care_transac!!');

        const serviceid=data.service_id[0];
        await runQuery(`insert into Shorttermcare (SHORTTERM_ID,LABOR_HOURS,REPAIR,WASH,COMPLETED)
        values(:serviceid,0,SHORT_CARE(:repairtype,0),SHORT_CARE(:washtype,0),'NO')`,
        {   
            serviceid,
            repairtype,
            washtype
        });
        console.log('Successful Insertion in shorttermcare!!');
        const service_date=date;
        await runQuery(`INSERT INTO takes_care (SERVICE_ID, VEHICLENO,SERVICE_DATE)
        VALUES (:serviceid, :vehicleno, TO_DATE(:service_date,'yyyy-mm-dd'))`,
        {   
            serviceid,
            vehicleno,
            service_date
        });
        console.log('Successful Insertion in takes_care!!');

        res.status(200).json({"service_id": data.service_id[0]});

    }catch(err){
        console.error(err);
        res.status(500).send('Error inserting the data');
    }
}


const longUser = async(req,res)=>{
    let {
        vehicleno,
        vehicleowner,
        date,
        main_category,
        finaldate,
        ins_prov,
        ins_expdate,
        odometer}=req.body;

        vehicleno = vehicleno.toUpperCase();
        // vehicletype = vehicletype.toUpperCase();
        // vehiclecompany = vehiclecompany.toUpperCase();
        // vehiclemodel = vehiclemodel.toUpperCase();
        // vehiclecolor = vehiclecolor.toUpperCase();
    try{
        const exists=await runQuery(
        `select * from vehicle_info 
        where VEHICLENO = :vehicleno AND VEHICLE_OWNER = :vehicleowner`,{vehicleno,vehicleowner});
        if(exists.length===0){
            res.status(200).json("No vehicle Found!");
            return;
        }
        // if(exists.length===0){
        //     await runQuery(`insert into vehicle_info (VEHICLENO, VEHICLE_OWNER, VEHICLETYPE, VEHICLE_MODEL, VEHICLE_COMPANY, VEHICLE_COLOR)
        //     values(:vehicleno,:vehicleowner,:vehicletype,:vehiclemodel,:vehiclecompany,:vehiclecolor)`,
        //     {   vehicleno,
        //         vehicleowner,
        //         vehicletype,
        //         vehiclemodel,
        //         vehiclecompany,
        //         vehiclecolor,
        //     });
        //     console.log('Successful Insertion in vehicle info!!');
        // }else{
        //     console.log('Already exists!!');
        // }
        console.log(finaldate);
        const data=await runQueryOutBinds(`insert into care_transac (MECHANIC_NAME,SERVICE_TYPE,SERVICING_COST)
        values('Not Selected','longterm',0)
        returning SERVICE_ID INTO :service_id`,
        {
                service_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        });
        console.log('Successful Insertion in care_transac!!');

        const serviceid=data.service_id[0];
        const service_date=date;
        await runQuery(`insert into Longtermcare (LONGTERM_ID,MAINTENANCE_CATEGORY,INSURANCE_PROVIDER,INSURANCE_EXP_DATE,ODOMETER_READING,FINAL_DATE)
        values(:serviceid,:main_category,:ins_prov,TO_DATE(:ins_expdate,'yyyy-mm-dd'),:odometer,TO_DATE(:finaldate,'yyyy-mm-dd'))`,
        {   
            serviceid,
            main_category,
            ins_prov,
            ins_expdate,
            odometer,
            finaldate
        });
        console.log('Successful Insertion in longtermcare!!');
        await runQuery(`INSERT INTO takes_care (SERVICE_ID, VEHICLENO,SERVICE_DATE)
        VALUES (:serviceid, :vehicleno, TO_DATE(:service_date,'yyyy-mm-dd'))`,
        {   
            serviceid,
            vehicleno,
            service_date
        });
        console.log('Successful Insertion in takes_care!!');

        // await runQuery(`INSERT INTO Maintenance_info(MAINTENANCE_ID, BASIC_DESC,PREMIUM_DESC,FLAG,LAST_SERVICE_DATE,NEXT_SERVICE_DATE)
        // VALUES (:serviceid,"Basic","Premium","flag" TO_DATE(:service_date,'yyyy-mm-dd'),TO_DATE(:service_date,'yyyy-mm-dd'))`,
        // {   
        //     serviceid,
        //     service_date,
        //     service_date
        // });
        // console.log('Successful Insertion in Maintenance_info!!');

        //res.status(200).json("Inserted in Longterm");
        res.status(200).json({"service_id": data.service_id[0]});

    }catch(err){
        console.error(err);
        res.status(500).send('Error inserting the data');
    }
}


const tableFetch = async(req,res)=>{
    try{
        const data = await runQuery(`select u.name,vi.vehicleno,ct.service_id,tc.service_date,
        sc.repair,sc.wash,ct.mechanic_name,ct.servicing_cost,sc.completed,sc.labor_hours
        from users u,vehicle_info vi,takes_care tc,care_transac ct,shorttermcare sc
        where u.userid=vi.vehicle_owner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=sc.shortterm_id
        order by completed,service_id`,{});
        //console.log(data);
        res.status(200).json({"table": data});
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the table');
    }
}

const updateTable = async(req,res)=>{
    const{
        service_id,
        mechanic,
        repairCost,
        washCost,
        labourHour,
        laborCost,
        status
    }=req.body;
    const servicing_cost = Number(repairCost+washCost+(labourHour*laborCost));
    try{
        console.log(req.body);
        await runQuery(`
        DECLARE
            v_repair SHORT_CARE;
            v_wash SHORT_CARE;
        BEGIN
            SELECT repair, wash INTO v_repair, v_wash
            FROM ShorttermCare
            WHERE shortterm_id =:service_id;
      
            v_repair.cost := :repairCost;
            v_wash.cost := :washCost;
      
            UPDATE ShorttermCare
            SET repair = v_repair,
            wash = v_wash,
            labor_hours=:labourHour,
            completed = :status
            WHERE shortterm_id = :service_id;
        END;`,{service_id,repairCost,washCost,labourHour,status,service_id});

        await runQuery(`update care_transac
        set mechanic_name=:mechanic,
        servicing_cost=:servicing_cost
        where service_id=:service_id`,{mechanic,servicing_cost,service_id});
        
        const data1 = await runQuery(`select * from care_transac
        where service_id=:service_id`,{service_id});
        const data2 = await runQuery(`select * from shorttermcare
        where shortterm_id=:service_id`,{service_id});
        res.status(200).json({data1,data2});
    }catch(err){
        console.error(err);
        res.status(500).send('Error updating the data');
    }
}


module.exports={
    pieData,
    lineData,
    shortUser,
    longUser,
    tableFetch,
    updateTable
}

