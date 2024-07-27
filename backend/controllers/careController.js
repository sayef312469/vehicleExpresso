const oracledb = require('oracledb')
const {getDaysInMonth, ReversemonthMap, monthMap}  = require('../monthTonum')
const {runQuery,runQueryOutBinds}=require('../connection')


const pieData = async(req, res)=>{
    try{
        let count =[];
        let d=[];
        const {year,month} = req.body;
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
    try{
        let {
            vehicleno,
            date,
            repairtype,
            washtype}=req.body;
            vehicleno = vehicleno.toUpperCase();
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
    try{
        let {
            vehicleno,
            vehicleowner,
            date,
            main_category,
            finaldate,
            ins_prov,
            ins_expdate,
            odometer}=req.body;

        const exists=await runQuery(
        `select * from vehicle_info 
        where VEHICLENO = :vehicleno AND VEHICLE_OWNER = :vehicleowner`,{vehicleno,vehicleowner});
        if(exists.length===0){
            res.status(200).json("No vehicle Found!");
            return;
        }

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
        await runQuery(`INSERT INTO maintenance_info(MAINTENANCE_ID)
        VALUES (:serviceid)`,
        {   
            serviceid
        });
        console.log('Successful Insertion in maintenance_info!!');
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


const shortTableFetch = async(req,res)=>{
    try{
        const data = await runQuery(`select u.name,vi.vehicleno,ct.service_id,to_char(tc.service_date,'yyyy-mm-dd') as service_date,
        sc.repair,sc.wash,ct.mechanic_name,ct.servicing_cost,sc.completed,sc.labor_hours
        from users u,vehicle_info vi,takes_care tc,care_transac ct,shorttermcare sc
        where u.userid=vi.vehicle_owner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=sc.shortterm_id
        order by completed,service_id`,{});
        res.status(200).json({"table": data});
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the table');
    }
}

const longTableFetch =async(req,res)=>{
    try{

        const data = await runQuery(`select distinct u.name,ct.service_id,vi.vehicleno,to_char(tc.service_date,'yyyy-mm-dd') as service_date,to_char(lc.final_date,'yyyy-mm-dd') as final_date,
        ct.mechanic_name,lc.odometer_reading,lc.maintenance_category,lc.insurance_provider,to_char(lc.insurance_exp_date,'yyyy-mm-dd') as insurance_exp_date,ct.servicing_cost
        from users u,vehicle_info vi,takes_care tc,care_transac ct,longtermcare lc,maintenance_info mi
        where u.userid=vi.vehicle_owner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=lc.longterm_id and
        ct.service_id=mi.maintenance_id 
        order by ct.service_id`,{});

        res.status(200).json({"table": data});
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the long-data');
    }
}

const maintenanceinfoFetch =async(req,res)=>{
    try{
        const {service_id}=req.body;
        const data = await runQuery(`select basic_desc,premium_desc,flag,to_char(last_service_date,'yyyy-mm-dd') as last_service_date,to_char(next_service_date,'yyyy-mm-dd') as next_service_date
        from maintenance_info where
        maintenance_id=:service_id
        order by last_service_date`,{service_id});

        res.status(200).json({"data":data});
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the maintenance info');
    }
}


const updateShortTable = async(req,res)=>{
    try{
        const{
            service_id,
            mechanic,
            repairCost,
            washCost,
            labourHour,
            laborCost,
            status
        }=req.body;

        const servicing_cost =repairCost+washCost+(labourHour*laborCost);

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
        res.status(500).send('Error updating the short-table data');
    }
}

const updateLongTable = async(req,res)=>{
    try{
        const {
            service_id,
            mechanic,
            totalCost,
            insExpdate,
            odometerRead
        }=req.body;
        console.log(insExpdate);
        await runQuery(`update care_transac 
        set mechanic_name=:mechanic,servicing_cost=:totalCost 
        where service_id=:service_id`,{mechanic,totalCost,service_id});
        //insExpdate=dateFormat();
        if(insExpdate){
            console.log('hello');
            await runQuery(`update longtermcare 
            set odometer_reading=:odometerRead,insurance_exp_date=TO_DATE(:insExpdate,'yyyy-mm-dd')
            where longterm_id=:service_id`,{odometerRead,insExpdate,service_id});
        }
        else{
            await runQuery(`update longtermcare 
            set odometer_reading=:odometerRead,insurance_exp_date=null
            where longterm_id=:service_id`,{odometerRead,service_id});
        }
        const data1 = await runQuery(`select * from care_transac
        where service_id=:service_id`,{service_id});
        const data2 = await runQuery(`select * from longtermcare
        where longterm_id=:service_id`,{service_id});
        res.status(200).json({data1,data2});
    }catch(err){
        console.error(err);
        res.status(500).send('Error updating the long-table data');
    }
}


const availVehicle=async(req,res)=>{
    try{
        const {vehicleOwner}=req.body;
        const data = await runQuery(`select vehicleno
        from vehicle_info where vehicle_owner=:vehicleOwner`,{vehicleOwner});

        const shortBill = await runQuery(`select tc.vehicleno,ct.service_type,sc.repair,sc.wash,ct.servicing_cost,to_char(tc.service_date,'yyyy-mm-dd') as SERVICE_DATE
        from vehicle_info vi,takes_care tc,care_transac ct,shorttermcare sc
        where vi.vehicle_owner=:vehicleOwner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=sc.shortterm_id and
        Upper(sc.completed)='YES'
        order by tc.service_date`,{vehicleOwner});
        const today = new Date().toISOString().slice(0,10);
        console.log(today);
        const longBill = await runQuery(`select tc.vehicleno,ct.service_type,lc.maintenance_category,ct.servicing_cost,to_char(tc.service_date,'yyyy-mm-dd') as SERVICE_DATE
        from vehicle_info vi,takes_care tc,care_transac ct,longtermcare lc,maintenance_info mi
        where vi.vehicle_owner=:vehicleOwner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=lc.longterm_id and
        ct.service_id=mi.maintenance_id and
        to_char(lc.final_date,'yyyy-mm-dd')<:today
        order by tc.service_date`,{vehicleOwner,today})
        res.status(200).json({data,shortBill,longBill});
    }catch(err){
        console.error(err);
        res.status(500).send('Fail to fetch vehicle no');
    }
}

const updateMaintInfo=async(req,res)=>{
  try{
    const {service_id,
      maintenance_type,
      description,
      next_maintenance_date,
      next_maintenance_type,
      totalcost
      }=req.body;
      let flag="00";
      if(maintenance_type==="Basic")flag='B'+flag.slice(1);
      else flag='P'+flag.slice(1);
      if(next_maintenance_type==="Basic")flag=flag.slice(0,1)+'B';
      else flag=flag.slice(0,1)+'P';

      maintenance_date=new Date().toISOString().slice(0,10);
      await runQuery(`insert into Maintenance_info (Maintenance_id,basic_desc,flag,last_service_date,next_service_date)
      values(:service_id,:description,:flag,to_date(:maintenance_date,'yyyy-mm-dd'),to_date(:next_maintenance_date,'yyyy-mm-dd'))`,{service_id,description,flag,maintenance_date,next_maintenance_date});

      const data=await runQuery(`select servicing_cost 
      from care_transac where service_id=:service_id`,{service_id});

      let updatedTotal=Number(data[0].SERVICING_COST)+totalcost;
      
      await runQuery(`update care_transac
      set servicing_cost=:updatedTotal where service_id=:service_id`,{updatedTotal,service_id});

      res.status(200).json({'Updatedcost':updatedTotal});
  }catch(err){
    console.error(err);
    res.status(500).send('Failed to update Maintenance Info');
  }
}

const deleteMaintInfo =async(req,res)=>{
    try{
        const {service_id,
        record}=req.body;
        console.log(service_id,record);
        if(record==='ShortTerm'){
            console.log('done');
            await runQuery(`delete from shorttermcare
            where shortterm_id=:service_id`,{service_id});
        }
        else{
            await runQuery(`delete from maintenance_info
            where maintenance_id=:service_id`,{service_id});
        }
        res.status(200).json(`${service_id} deleted successfully!!`);
    }catch(err){
        console.error(err);
        res.status(500).send('Failed to delete Maintenance Info');
    }
}

module.exports={
    pieData,
    lineData,
    shortUser,
    longUser,
    shortTableFetch,
    longTableFetch,
    maintenanceinfoFetch,
    updateShortTable,
    updateLongTable,
    availVehicle,
    updateMaintInfo,
    deleteMaintInfo
}


