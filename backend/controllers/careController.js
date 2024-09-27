const oracledb = require('oracledb')
const {getDaysInMonth, ReversemonthMap, monthMap, columnMap}  = require('../monthTonum')
const {runQuery,runQueryOutBinds}=require('../connection');

//function
const pieData = async(req, res)=>{
    try{
        let count =[];
        let {year,month} = req.body;
        if(month==='ALL') month=null;
            let result = await runQueryOutBinds(`
                BEGIN
                    :count1 := RET_PIEDATA(:year,:month,'Basic');
                    :count2 := RET_PIEDATA(:year,:month,'Premium');
                    :count3 := RET_PIEDATA(:year,:month,'Repair');
                    :count4 := RET_PIEDATA(:year,:month,'Wash');
                END;
            `,
            {
                year,
                month,
                count1:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
                count2:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
                count3:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
                count4:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
            });

            count = [
                { 'Basic': result.count1  },
                { 'Premium': result.count2},
                { 'Repair': result.count3 },
                { 'Wash': result.count4   }
            ];
        res.status(200).json({
            "slicedata": count
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Error quering the Piedata');
    }
}

//procedure
const lineData = async(req,res)=>{
    try{
        const {year,month} = req.body;
        let months=[];
        let days=[];
        if(month==="ALL" || !month){
            for(let mon=1;mon<=12;++mon){
            const data=await runQueryOutBinds(`
                    DECLARE
                        COUNT_ INTEGER;
                    BEGIN
                        RET_LINEDATA(:mon,NULL,:year,COUNT_);
                        :count := COUNT_;
                    END;
                `,
                {
                    mon,
                    year,
                    count:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
                });
                months.push({ [ReversemonthMap[mon]]: data.count });  
            }
            res.status(200).json({
                "monthCost": months
            }); 
        }
        else{
            const  monthCount = monthMap[month];
            const total=getDaysInMonth(monthCount, year);
            for(let day=1;day<=total;++day){
                const data=await runQueryOutBinds(`
                    DECLARE
                        COUNT_ INTEGER;
                    BEGIN
                        RET_LINEDATA(:monthCount,:day,:year,COUNT_);
                        :count := COUNT_;
                    END;
                `,
                {
                    monthCount,
                    day,
                    year,
                    count:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
                });
                days.push({[`Day ${day}`]: data.count});  
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

//function

const shortUser = async(req,res)=>{
    try{
        let {
            vehicleno,
            date,
            repairtype,
            washtype
        }=req.body;

        const data=await runQueryOutBinds(`insert into care_transac(SERVICE_ID,MECHANIC_NAME,SERVICE_TYPE,SERVICING_COST)
        values(service_id.nextval,'Not Selected','shortterm',0)
        returning SERVICE_ID INTO :service_id`,
        {
                service_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        });
        console.log('Successful Insertion in care_transac!!');

        const serviceid=data.service_id[0];
        await runQuery(`insert into Shorttermcare (SHORTTERM_ID,LABOR_HOURS,REPAIR,WASH,COMPLETED)
        values(:serviceid, 0, SHORT_CARE(:repairtype,0),SHORT_CARE(:washtype,0),'NO')`,
        {   
            serviceid,
            repairtype,
            washtype
        });
        console.log('Successful Insertion in shorttermcare!!');

        const service_date=date;
        await runQuery(`INSERT INTO takes_care (SERVICE_ID, VEHICLENO,SERVICE_DATE)
        VALUES (:serviceid, upper(:vehicleno), TO_DATE(:service_date,'yyyy-mm-dd'))`,
        {   
            serviceid,
            vehicleno,
            service_date
        });
        console.log('Successful Insertion in takes_care!!');

        res.status(200).json({"service_id": serviceid});

    }catch(err){
        console.error(err);
        res.status(500).send('Error inserting the data');
    }
}

//function

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

        const data=await runQueryOutBinds(`insert into care_transac (SERVICE_ID,MECHANIC_NAME,SERVICE_TYPE,SERVICING_COST)
        values(service_id.nextval,'Not Selected','longterm',0)
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
        res.status(200).json({"service_id": serviceid});

    }catch(err){
        console.error(err);
        res.status(500).send('Error inserting the data');
    }
}

//view
const shortTableFetch = async(req,res)=>{
    try{
        const {lowindx, highindx, filterby, filterterm} = req.body;

        console.log(columnMap[filterby]);
        const table = await runQuery(`
        select * from
            view_short_table
        where
            LOWER(${columnMap[filterby]}) like LOWER(:filterterm)`,
            {
                filterterm: `%${filterterm}%`
            });

        const data = await runQuery(`
            select * from
                view_short_table
            where
                LOWER(${columnMap[filterby]}) like LOWER(:filterterm) and
                row_num between :lowindx and :highindx
            order by 
                row_num`,{filterterm: `%${filterterm}%`, lowindx, highindx});

        res.status(200).json({
            'size': table.length,
            'table': data
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the table');
    }
}

//view
const longTableFetch =async(req,res)=>{
    try{
        const {lowindx, highindx, filterby, filterterm} = req.body;
        console.log(columnMap[filterby]);
        const table = await runQuery(`
        select *
        from 
            view_long_table
        where 
        LOWER(${columnMap[filterby]}) like LOWER(:filterterm)`,{filterterm: `%${filterterm}%`})

        const data = await runQuery(`
        select *
        from 
            view_long_table
        where 
            LOWER(${columnMap[filterby]}) like LOWER(:filterterm) and
            row_num between :lowindx and :highindx`,
        {
            filterterm: `%${filterterm}%`, 
            lowindx,
            highindx
        });
        console.log(table.length);
        res.status(200).json({
            'size': table.length,
            'table': data
        });
    }catch(err){
        console.error(err);
        res.status(500).send('Error fetching the long-data');
    }
}

const maintenanceinfoFetch =async(req,res)=>{
    try{
        const {service_id}=req.body;
        const data = await runQuery(`select 
        description,
        to_char(last_service_date,'yyyy-mm-dd') as last_service_date,
        to_char(next_service_date,'yyyy-mm-dd') as next_service_date
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

            UPDATE care_transac
            set mechanic_name=:mechanic,
            servicing_cost=(v_repair.cost + v_wash.cost)+(:labourHour * :laborCost)
            where service_id=:service_id;

        END;`,{service_id,repairCost,washCost,labourHour,status,service_id,mechanic,labourHour, laborCost});
        
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
        
        if(insExpdate){
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

        const imageUrl =  await runQuery(`select pro_url
        from users where userid=:vehicleOwner`,{vehicleOwner});

        const shortBill = await runQuery(`select tc.vehicleno,ct.service_type,sc.repair,sc.wash,ct.servicing_cost,to_char(tc.service_date,'yyyy-mm-dd') as SERVICE_DATE
        from vehicle_info vi,takes_care tc,care_transac ct,shorttermcare sc
        where vi.vehicle_owner=:vehicleOwner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=sc.shortterm_id and
        Upper(sc.completed)='YES'
        order by tc.service_date`,{vehicleOwner});


        const longBill = await runQuery(`select tc.vehicleno,ct.service_type,lc.maintenance_category,ct.servicing_cost,to_char(tc.service_date,'yyyy-mm-dd') as SERVICE_DATE
        from vehicle_info vi,takes_care tc,care_transac ct,longtermcare lc,maintenance_info mi
        where vi.vehicle_owner=:vehicleOwner and
        vi.vehicleno=tc.vehicleno and
        tc.service_id=ct.service_id and
        ct.service_id=lc.longterm_id and
        ct.service_id=mi.maintenance_id and
        to_date(lc.final_date,'yyyy-mm-dd') < to_date(SYSDATE,'yyyy-mm-dd')
        order by tc.service_date`,{vehicleOwner})
        console.log('yooooooooo');
        res.status(200).json({data,imageUrl,shortBill,longBill});
    }catch(err){
        console.error(err);
        res.status(500).send('Fail to fetch vehicle no');
    }
}

//trigger
const updateMaintInfo=async(req,res)=>{
  try{
    const {
        service_id,
        description,
        next_maintenance_date,
        totalcost
    }=req.body;

    await runQuery(`insert into Maintenance_info (Maintenance_id,description,last_service_date,next_service_date,maintenance_cost)
    values(
        :service_id,
        :description,
        to_date(SYSDATE,'yyyy-mm-dd'),
        to_date(:next_maintenance_date,'yyyy-mm-dd'),
        :totalcost
    )`,{service_id,description,next_maintenance_date,totalcost});

    const data=await runQuery(`select servicing_cost 
    from care_transac where service_id=:service_id`,{service_id});

    const updatedTotal=Number(data[0].SERVICING_COST)+totalcost;

    res.status(200).json({'Updatedcost':updatedTotal});
  }catch(err){
    console.error(err);
    res.status(500).send('Failed to update Maintenance Info');
  }
}

//trigger
const deleteMaintInfo =async(req,res)=>{
    try{
        const {
        service_id,
        record
        }=req.body;
        console.log(service_id,record);
        if(record==='ShortTerm'){
            await runQuery(`delete from shorttermcare
            where shortterm_id=:service_id`,{service_id});
        }
        else{
            await runQuery(`delete from longtermcare
            where longterm_id=:service_id`,{service_id});
        }
        res.status(200).json(`${service_id} deleted successfully!!`);
    }catch(err){
        console.error(err);
        res.status(500).send('Failed to delete Maintenance Info');
    }
}


const fetchOldChats = async(req,res)=>{
    try{
        const {userId, adminId} = req.body;
        console.log('this is',userId);
        const chatHistory = await runQuery(`
        select * 
        from 
            carechat
        where 
            (user_id=:userId
        and 
            (admin_id < 0
        or
            admin_id=:adminId)
        )or
            user_id=:userId
        order by 
            sent_at asc`,{userId, adminId})
        
        res.status(200).json({
           oldChats: chatHistory
        })
    }catch(err){
        console.error(err)
    }
}

const storeNewChats = async(data)=>{
    try{
        const {adminId, userId, text} = data;
        if(adminId<0){
            await runQuery(`insert into carechat( admin_id, user_id, text)
            values(:adminId,:userId,:text)`,{adminId, userId, text});
        }
        else{
            await runQuery(`insert into carechat( admin_id, user_id, text)
            values(:adminId,:userId ,:text)`,{adminId, userId, text});
        }
        console.log('chat history insertion successful!');
    }catch(err){
        console.error(err);
    }
}

const fetchContacts = async(req,res)=>{
    try{
        const {user_id}= req.body;
        console.log(user_id);
        const data = await runQuery(`
        select* 
        from(
            select 
                u.userid as userid,
                u.name as name, 
                u.pro_url as imageurl,
                c.text as text,
                c.sent_at as sent_at
            from
                carechat c
            join
                (select 
                    user_id,
                    max(sent_at) as time
                from 
                    carechat
                group by
                    user_id) 
                lm
            on 
                c.sent_at=lm.time
            and
                c.user_id=lm.user_id
            right join
                users u
            on
                u.userid=c.user_id
            ) 
            where 
                userid>100
            order by 
                sent_at desc NULLS LAST`,{})
        
        const unread = await runQuery(`
        select 
            contact_count
        from 
            unreadchat 
        where 
            id=:user_id`,{user_id});

        res.status(200).json({
            contacts: data,
            unread: unread[0]!==undefined?unread[0].CONTACT_COUNT:0
        })

    }catch(err){
        console.error(err);
    }
}

const StoreUnreadMessages = async(req,res)=>{
    try{
        const {user_id, count} = req.body;
        const exists = await runQuery(`select * 
        from 
            unreadChat
        where 
            id=:user_id`,{user_id});
        if(exists.length===0){
            await runQuery(`insert into unreadchat(id,msg_count)
            values(:user_id,:count)`,{user_id, count});
            res.status(200).send({msg: 'insertion success'});
        }
        else{
            await runQuery(`update 
                unreadchat
            set 
                msg_count=:count
            where 
                id=:user_id`,{count,user_id});
            res.status(200).send({msg: 'update success'});
        }
    }catch(err){
        console.error(err);
    }
}

const fetchUnreadMessages = async(req,res)=>{
    try{
        const {user_id}= req.body;
        const count =  await runQuery(`
        select 
            msg_count
        from 
            unreadchat
        where 
            id=:user_id`,{user_id});
        console.log(count);
        res.status(200).json({
            count: count[0]?count[0].MSG_COUNT:0
        })
    }catch(err){
        console.error(err);
    }
}

const storeUnreadContacts = async(req,res)=>{
    try{
        const {user_id, count} = req.body;
        console.log(user_id, count);
        const exists = await runQuery(`select * 
        from 
            unreadChat
        where 
            id=:user_id`,{user_id});
        
        if(exists.length===0){
            await runQuery(`insert into unreadchat(id,contact_count)
            values(:user_id,:count)`,{user_id, count}) 
            res.status(200).send({msg: 'insertion successful'})
        }else{
            console.log(exists.length);
            await runQuery(`update 
                unreadchat
            set 
                contact_count=:count
            where 
                id=:user_id`,{count,user_id});
            res.status(200).send({msg: 'update success'});
        }   
    }catch(err){
        console.error(err);
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
    deleteMaintInfo,
    fetchOldChats,
    storeNewChats,
    fetchContacts,
    StoreUnreadMessages,
    fetchUnreadMessages,
    storeUnreadContacts
}


