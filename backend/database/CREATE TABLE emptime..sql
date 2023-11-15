

CREATE TABLE `emptimesheet` (
  `timesheet_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` date NOT NULL,
  `working_hours` varchar(100) NOT NULL,
  `leaves` date DEFAULT NULL,
  `holiday` date DEFAULT NULL,
  `employee_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`timesheet_id`),
  KEY `emptimesheet_FK` (`employee_id`),
  CONSTRAINT `emptimesheet_FK` FOREIGN KEY (`employee_id`) REFERENCES `empdata` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;