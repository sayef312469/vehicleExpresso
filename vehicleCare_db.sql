
---------------------------------------------------VEHICLE_CARE-------------------------------------------------
CREATE TABLE Care_Transac(
    service_id INTEGER,
    mechanic_name VARCHAR2(20) not null,
    service_type VARCHAR2(20) not null,
    servicing_cost NUMBER,
    CONSTRAINT pk_service_id PRIMARY KEY(service_id)
);

CREATE TABLE LongtermCare(
    longterm_id INTEGER not null,
    Maintenance_category VARCHAR2(20) not null,
    insurance_provider VARCHAR2(20),
    insurance_exp_date DATE,
    odometer_reading VARCHAR2(20) not null,
    final_date DATE not null,
    CONSTRAINT fk_longterm_id FOREIGN KEY (longterm_id) REFERENCES Care_Transac(service_id)
);

CREATE TABLE Maintenance_Info(
    maintenance_id INTEGER not null,
    description VARCHAR(255),
    last_service_date DATE,
    next_service_date DATE,
    maintenance_cost NUMBER
    CONSTRAINT fk_maintenance_id FOREIGN KEY (maintenance_id) REFERENCES Care_Transac(service_id)
);

CREATE TYPE SHORT_CARE AS OBJECT(
    type VARCHAR2(100),
    cost NUMBER
)

CREATE table Takes_Care(
    service_id INTEGER,
    vehicleno varchar2(100),
    service_date DATE,
    CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES Care_Transac(service_id), 
    CONSTRAINT fk_vehicleno FOREIGN KEY (vehicleno) REFERENCES vehicle_info(vehicleno)
);

CREATE TABLE ShorttermCare(
    shortterm_id INTEGER not null,
    labor_hours NUMBER not null,
    repair SHORT_CARE,
    wash SHORT_CARE,
    completed VARCHAR(20) not null,
    CONSTRAINT fk_shortterm_id FOREIGN KEY (shortterm_id) REFERENCES Care_Transac(service_id)
);


CREATE TABLE CARECHAT(
    admin_id NUMBER not NULL,
    user_id NUMBER not NULL,
    text VARCHAR2(4000) not NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES USERS (userid)
);

CREATE INDEX msg_time_idx ON CareChat(sent_at);
CREATE INDEX user_id_idx ON CareChat(user_id);


CREATE TABLE UNREADCHAT(
    id NUMBER not NULL,
    msg_count NUMBER,
    contact_count NUMBER,
    CONSTRAINT fk_id FOREIGN KEY (id) REFERENCES USERS (userid)
)



---------------------------NEW CHANGES-----------------------------

--------------Sequence-------------
CREATE SEQUENCE SERVICE_ID
START WITH 100
INCREMENT BY 1
MAXVALUE 9999999
CACHE 100
CYCLE


---FUNCTION----

CREATE OR REPLACE FUNCTION RET_PIEDATA
(year NUMBER, month VARCHAR2, term VARCHAR2)
return INTEGER
IS
    COUNT_ INTEGER;
BEGIN
        IF term = 'Basic' or term = 'Premium' THEN
            select count(c.SERVICE_ID)
            INTO COUNT_
            from CARE_TRANSAC c,LONGTERMCARE l,TAKES_CARE t where 
            c.SERVICE_ID=l.LONGTERM_ID AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            (month is NULL or to_char(t.SERVICE_DATE,'MON')=month) AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=year AND 
            l.MAINTENANCE_CATEGORY= term;
        ELSIF term= 'Repair' THEN
            select count(c.SERVICE_ID)
            INTO COUNT_
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            (month is NULL or to_char(t.SERVICE_DATE,'MON')=month) AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=year AND 
            s.REPAIR.type is not null;
        ELSE 
            select count(c.SERVICE_ID)
            INTO COUNT_
            from CARE_TRANSAC c,SHORTTERMCARE s,TAKES_CARE t where 
            c.SERVICE_ID in(SELECT s.SHORTTERM_ID FROM SHORTTERMCARE) AND 
            c.SERVICE_ID=t.SERVICE_ID AND 
            (month is NULL or to_char(t.SERVICE_DATE,'MON')=month) AND
            EXTRACT(YEAR FROM t.SERVICE_DATE)=year AND 
            s.WASH.type is not null;
        END IF;
    return COUNT_;
END;


-----PROCEDURE--------

CREATE OR REPLACE PROCEDURE RET_LINEDATA
(month IN NUMBER, day in NUMBER,year IN NUMBER,COUNT_ OUT INTEGER)
IS

BEGIN
    SELECT NVL(SUM(c.SERVICING_COST),0)
    INTO COUNT_
    FROM CARE_TRANSAC c,TAKES_CARE t WHERE 
    (day is NULL or EXTRACT(DAY FROM t.SERVICE_DATE)=day)AND
    EXTRACT(MONTH FROM t.SERVICE_DATE)=month AND 
    EXTRACT(YEAR FROM t.SERVICE_DATE)=year AND
    c.SERVICE_ID=t.SERVICE_ID;
END;


-------TRIGGER-----------
CREATE OR REPLACE TRIGGER TRIGG_SERVICING_COST
AFTER INSERT ON MAINTENANCE_INFO
FOR EACH ROW

BEGIN
    update care_transac
    set servicing_cost=(:NEW.maintenance_cost+servicing_cost) where service_id=:NEW.maintenance_id;
END;

CREATE OR REPLACE TRIGGER TRIGG_DELETE_LONG_ID
AFTER DELETE ON LONGTERMCARE
FOR EACH ROW

BEGIN

    delete from MAINTENANCE_INFO
    where maintenance_id=:OLD.longterm_id;

    delete from TAKES_CARE
    where service_id =:OLD.longterm_id;

END;

CREATE OR REPLACE TRIGGER TRIGG_DELETE_SHORT_ID
AFTER DELETE ON SHORTTERMCARE
FOR EACH ROW

BEGIN

    delete from TAKES_CARE
    where service_id =:OLD.shortterm_id;

END;

-----------------VIEW-----------------

CREATE OR REPLACE VIEW view_short_table
(
    row_num,
    name,
    vehicleno,
    service_id,
    service_date,
    repairtype,
    repaircost,
    washtype,
    washcost,
    mechanic_name,
    servicing_cost,
    completed,
    labor_hours
)
AS select 
    ROW_NUMBER() OVER (order by sc.completed,ct.service_id), 
    u.name,
    vi.vehicleno,
    ct.service_id,
    to_char(tc.service_date,'yyyy-mm-dd') as service_date,
    sc.repair.type as repairtype,
    sc.repair.cost as repaircost, 
    sc.wash.type as washtype,
    sc.wash.cost as washcost, 
    ct.mechanic_name,
    ct.servicing_cost,
    sc.completed, 
    sc.labor_hours 
from 
    users u,
    vehicle_info vi,
    takes_care tc,
    care_transac ct,
    shorttermcare sc
    where u.userid=vi.vehicle_owner and
    vi.vehicleno=tc.vehicleno and
    tc.service_id=ct.service_id and
    ct.service_id=sc.shortterm_id
WITH READ ONLY;

CREATE OR REPLACE VIEW view_long_table
(
    row_num,
    name,
    service_id,
    vehicleno,
    service_date,
    final_date,
    mechanic_name,
    odometer_reading,
    maintenance_category,
    insurance_provider,
    insurance_exp_date,
    servicing_cost
)
AS select 
    ROW_NUMBER() OVER (order by ct.service_id), 
    u.name,
    ct.service_id,
    vi.vehicleno,
    to_char(tc.service_date,'yyyy-mm-dd'),
    to_char(lc.final_date,'yyyy-mm-dd'),
    ct.mechanic_name,
    lc.odometer_reading,
    lc.maintenance_category,
    lc.insurance_provider,
    to_char(lc.insurance_exp_date,'yyyy-mm-dd'),
    ct.servicing_cost
from 
    users u,
    vehicle_info vi,
    takes_care tc,
    care_transac ct,
    longtermcare lc
    where u.userid=vi.vehicle_owner and
    vi.vehicleno=tc.vehicleno and
    tc.service_id=ct.service_id and
    ct.service_id=lc.longterm_id
WITH READ ONLY;


-------TABLE CHANGES-------


ALTER TABLE MAINTENANCE_INFO
ADD maintenance_cost NUMBER;

----------------------------------------------------



------DROP TABLES-----
drop table ShorttermCare;
drop table LongtermCare;
drop table Maintenance_Info;
drop table Takes_Care;
drop table Care_Transac;


