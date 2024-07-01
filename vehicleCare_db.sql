
---------------------------------------------------VEHICLE_CARE-------------------------------------------------
CREATE TABLE Care_Transac(
    service_id INTEGER generated always as identity(start with 100 increment by 1),
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
    basic_desc VARCHAR(255),
    premium_desc VARCHAR(255),
    flag VARCHAR(20),
    last_service_date DATE,
    next_service_date DATE,
    CONSTRAINT fk_maintenance_id FOREIGN KEY (maintenance_id) REFERENCES Care_Transac(service_id)
);

CREATE TYPE SHORT_CARE AS OBJECT(
    type VARCHAR2(20),
    cost NUMBER
)

CREATE table Takes_Care(
    service_id INTEGER,
    vehicleno varchar2(100),
    service_date DATE,
    CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES Care_Transac(service_id)
    CONSTRAINT fk_vehicleno FOREIGN KEY (vehicleno) REFERENCES vehicle_info(vehicleno)//
)

CREATE TABLE ShorttermCare(
    shortterm_id INTEGER not null,
    labor_hours NUMBER not null,
    repair SHORT_CARE,
    wash SHORT_CARE,
    completed VARCHAR(20) not null,
    CONSTRAINT fk_shortterm_id FOREIGN KEY (shortterm_id) REFERENCES Care_Transac(service_id)
);
