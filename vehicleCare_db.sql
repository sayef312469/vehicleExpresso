
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



------DROP TABLES-----
drop table ShorttermCare;
drop table LongtermCare;
drop table Maintenance_Info;
drop table Takes_Care;
drop table Care_Transac;