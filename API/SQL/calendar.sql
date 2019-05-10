CREATE TABLE `calendar` ( `service_id` VARCHAR(3) NOT NULL ,
`monday` VARCHAR(1) NOT NULL ,
`tuesday` VARCHAR(1) NOT NULL ,
`wednesday` VARCHAR(1) NOT NULL ,
`thursday` VARCHAR(1) NOT NULL ,
`friday` VARCHAR(1) NOT NULL ,
`saturday` VARCHAR(1) NOT NULL ,
`sunday` VARCHAR(1) NOT NULL ,
`start_date` VARCHAR(8) NOT NULL ,
`end_date` VARCHAR(8) NOT NULL ,
PRIMARY KEY (`service_id`));
INSERT INTO `calendar` ( `service_id`,`monday`,`tuesday`,`wednesday`,`thursday`,`friday`,`saturday`,`sunday`,`start_date`,`end_date`) VALUES 
("USD","1","1","1","1","1","1","1","20080101","20190101"),
("U__","1","1","1","1","1","0","0","20080101","20190101"),
("US_","1","1","1","1","1","1","0","20080101","20190101"),
("_SD","0","0","0","0","0","1","1","20080101","20190101"),
("__D","0","0","0","0","0","0","1","20080101","20190101"),
("_S_","0","0","0","0","0","1","0","20080101","20190101");