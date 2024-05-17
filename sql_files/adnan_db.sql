CREATE TABLE Care_Transac(
    vehicle_id INTEGER not null,
    user_id INTEGER not null,
    service_id INTEGER generated always as identity(start with 1 increment by 1),
    date_ DATE not null,
    mechanic VARCHAR2(20) not null,
    servicing_cost NUMBER not null,
    service_type VARCHAR2(20) not null,
    CONSTRAINT pk_service_id PRIMARY KEY(service_id)
);

CREATE TABLE LongtermCare(
    longterm_id INTEGER not null,
    final_date DATE not null,
    service_category VARCHAR2(20) not null,
    insurance_provider VARCHAR2(20),
    insurance_policy_no VARCHAR2(20),
    insurance_exp_date DATE,
    odometer_reading VARCHAR2(20) not null,
    CONSTRAINT fk_longterm_id FOREIGN KEY (longterm_id) REFERENCES Care_Transac(service_id)

);

CREATE TABLE ShorttermCare(
    shortterm_id INTEGER not null,
    labor_hours NUMBER not null,
    service_category VARCHAR2(20) not null,
    completed VARCHAR2(20),
    CONSTRAINT fk_shortterm_id FOREIGN KEY (shortterm_id) REFERENCES Care_Transac(service_id)
);

CREATE TYPE BASIC AS OBJECT(
    oil_changes VARCHAR2(20),
    fluid_checks VARCHAR2(20),
    tire_rotation VARCHAR2(20),
    brake_inspection VARCHAR2(20),
    air_filter_replacement VARCHAR2(20),
    battery_maintenance VARCHAR2(20)
);
CREATE TABLE Basic_Maintenance(
    basic_id INTEGER not null,
    maintenance_type BASIC not null,
    last_service_date DATE,
    next_service_date DATE not null,
    CONSTRAINT fk_basic_id FOREIGN KEY (basic_id) REFERENCES Care_Transac(service_id)
);


CREATE TYPE PREMIUM AS OBJECT(
    fuel_system_cleaning VARCHAR2(20),
    spark_plug_replacement VARCHAR2(20),
    timing_belt_replacement VARCHAR2(20),
    coolant_flush VARCHAR2(20),
    transmission_service VARCHAR2(20),
    suspension_and_steering VARCHAR2(20),
    insurance_renewal VARCHAR2(20)
);
CREATE TABLE Premium_Maintenance(
    premium_id INTEGER not null,
    maintenance_type PREMIUM not null,
    last_service_date DATE,
    next_service_date DATE not null,
    CONSTRAINT fk_premium_id FOREIGN KEY (premium_id) REFERENCES Care_Transac(service_id)
);

CREATE TABLE Vehicle_Repair(
    repair_id INTEGER not null,
    repair_type VARCHAR2(20) not null,
    new_parts VARCHAR2(20),
    parts_repaired VARCHAR2(20) not null,
    CONSTRAINT fk_repair_id FOREIGN KEY(repair_id) REFERENCES Care_Transac(service_id)
);

CREATE TABLE Vehicle_Wash(
    wash_id INTEGER not null,
    wash_type VARCHAR2(20) not null,
    products_used VARCHAR2(100) not null,
    CONSTRAINT fk_wash_id FOREIGN KEY(wash_id) REFERENCES Care_Transac(service_id)
);

insert into Care_Transac
values(1,2,DEFAULT,to_date('05/09/2024','mm/dd/yyyy'),'Mr. Milton',40000,'Basic');
insert into Care_Transac
values(2,3,DEFAULT,to_date('05/20/2024','mm/dd/yyyy'),'Mr. Samurai',98000,'Premium');

insert into LongtermCare
values(1,to_date('05/09/2024','mm/dd/yyyy'),'Basic','Green Delta','500045',to_date('05/20/2024','mm/dd/yyyy'),'5000');
insert into LongtermCare
values(2,to_date('05/25/2024','mm/dd/yyyy'),'Premium','Green Delta','500045',to_date('06/3/2024','mm/dd/yyyy'),'20000');

insert into ShorttermCare
values(2,4,'Repair','Yes');
insert into ShorttermCare
values(1,4,'Wash','No');

INSERT INTO Basic_Maintenance
values(1,BASIC('Completed','Pending','Completed','Pending','Completed','Pending'),to_date('05/20/2024','mm/dd/yyyy'),to_date('06/20/2024','mm/dd/yyyy'));
INSERT INTO Basic_Maintenance
values(2,BASIC('Completed','Completed','Completed','Pending','Pending','Completed'),to_date('02/20/2024','mm/dd/yyyy'),to_date('03/20/2024','mm/dd/yyyy'));

INSERT INTO Premium_Maintenance
values(1,PREMIUM('Completed','Pending','Completed','Pending','Completed','Pending','Pending'),to_date('05/20/2024','mm/dd/yyyy'),to_date('06/20/2024','mm/dd/yyyy'));
INSERT INTO Premium_Maintenance
values(2,PREMIUM('Completed','Completed','Completed','Pending','Pending','Completed','Completed'),to_date('02/20/2024','mm/dd/yyyy'),to_date('03/20/2024','mm/dd/yyyy'));

insert into Vehicle_Repair
values(1,'Tire puncture','2 x new Tires');
insert into Vehicle_Repair
values(2,'Broken Glass','New Glass');

insert into vehicle_wash
values('1','Internal','Fabric Upholstery Cleaner,Glass Cleaner');
insert into vehicle_wash
values('2','External','Car Wash Soap,Glass Cleaner');
