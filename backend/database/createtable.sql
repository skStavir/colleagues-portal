CREATE TABLE humaneoserver.dbo.timesheet (
	empname varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[month] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Date] date NOT NULL,
	Worknghours int NOT NULL,
	Leavehours int NULL,
	Holidayhours int NULL
);