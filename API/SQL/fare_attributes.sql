CREATE TABLE `fare_attributes` ( `fare_id` VARCHAR(50) NOT NULL ,
`price` VARCHAR(8) NOT NULL ,
`currency_type` VARCHAR(3) NOT NULL ,
`payment_method` VARCHAR(2) NOT NULL ,
`transfers` VARCHAR(2) NOT NULL ,
`transfer_duration` VARCHAR(6) NOT NULL,
PRIMARY KEY (fare_id));
INSERT INTO `fare_attributes` ( `fare_id`,`price`,`currency_type`,`payment_method`,`transfers`,`transfer_duration` ) VALUES 
("CPTM","4.000000","BRL","0","","10800"),
("Metrô","4.000000","BRL","0","","10800"),
("Ônibus","4.000000","BRL","0","","10800"),
("Ônibus + CPTM","6.960000","BRL","0","","10800"),
("Ônibus + Metrô","6.960000","BRL","0","","10800"),
("Ônibus + Metrô + CPTM","7.650000","BRL","0","","10800");