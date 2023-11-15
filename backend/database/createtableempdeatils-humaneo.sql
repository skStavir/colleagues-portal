CREATE TABLE humaneoserver.dbo.humaneoemployees (
	emp_id int NOT NULL,
	emp_name varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Designation varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ReportingManger varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Joining date] date NOT NULL,
	Email varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Action] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__humaneoe__1299A861C34EB22C PRIMARY KEY (emp_id)
);