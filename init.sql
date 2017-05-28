-- ----------------------------
-- Table structure for TBook
-- ----------------------------
DROP TABLE [dbo].[TBook]
GO
CREATE TABLE [dbo].[TBook] (
[BookID] int NOT NULL IDENTITY(1,1) ,
[BookInfoID] int NOT NULL ,
[SerialCode] char(12) NOT NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[TBook]', RESEED, 27)
GO

-- ----------------------------
-- Table structure for TBookInfo
-- ----------------------------
DROP TABLE [dbo].[TBookInfo]
GO
CREATE TABLE [dbo].[TBookInfo] (
[BookInfoID] int NOT NULL IDENTITY(1,1) ,
[ISBN] char(18) NOT NULL ,
[BookName] char(50) NOT NULL ,
[Author] char(20) NOT NULL ,
[Publisher] char(40) NOT NULL ,
[Price] float(53) NOT NULL DEFAULT ((0)) ,
[Summary] varchar(400) NOT NULL ,
[Cover] varbinary(MAX) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[TBookInfo]', RESEED, 7)
GO

-- ----------------------------
-- Table structure for TLend
-- ----------------------------
DROP TABLE [dbo].[TLend]
GO
CREATE TABLE [dbo].[TLend] (
[LendID] int NOT NULL IDENTITY(1,1) ,
[BookID] int NOT NULL ,
[ReaderID] int NOT NULL ,
[LendTime] datetime NOT NULL ,
[BackTime] datetime NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[TLend]', RESEED, 28)
GO

-- ----------------------------
-- Table structure for TReader
-- ----------------------------
DROP TABLE [dbo].[TReader]
GO
CREATE TABLE [dbo].[TReader] (
[ReaderID] int NOT NULL IDENTITY(1,1) ,
[Card] char(8) NOT NULL ,
[Name] char(16) NOT NULL ,
[Sex] bit NOT NULL ,
[Born] date NOT NULL ,
[Spec] char(40) NOT NULL ,
[Photo] varbinary(MAX) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[TReader]', RESEED, 8)
GO

-- ----------------------------
-- Indexes structure for table TBook
-- ----------------------------
CREATE INDEX [IndexBookSerialCode] ON [dbo].[TBook]
([SerialCode] ASC) 
GO

-- ----------------------------
-- Primary Key structure for table TBook
-- ----------------------------
ALTER TABLE [dbo].[TBook] ADD PRIMARY KEY ([BookID])
GO

-- ----------------------------
-- Uniques structure for table TBook
-- ----------------------------
ALTER TABLE [dbo].[TBook] ADD UNIQUE ([SerialCode] ASC)
GO

-- ----------------------------
-- Indexes structure for table TBookInfo
-- ----------------------------
CREATE UNIQUE INDEX [IndexBookInfoISBN] ON [dbo].[TBookInfo]
([ISBN] ASC) 
GO
CREATE INDEX [IndexBookInfoName] ON [dbo].[TBookInfo]
([BookName] ASC) 
GO

-- ----------------------------
-- Primary Key structure for table TBookInfo
-- ----------------------------
ALTER TABLE [dbo].[TBookInfo] ADD PRIMARY KEY ([BookInfoID])
GO

-- ----------------------------
-- Uniques structure for table TBookInfo
-- ----------------------------
ALTER TABLE [dbo].[TBookInfo] ADD UNIQUE ([ISBN] ASC)
GO

-- ----------------------------
-- Indexes structure for table TLend
-- ----------------------------
CREATE INDEX [IndexLendBookID] ON [dbo].[TLend]
([BookID] ASC) 
GO
CREATE INDEX [IndexLendReaderID] ON [dbo].[TLend]
([ReaderID] ASC) 
GO

-- ----------------------------
-- Primary Key structure for table TLend
-- ----------------------------
ALTER TABLE [dbo].[TLend] ADD PRIMARY KEY ([LendID])
GO

-- ----------------------------
-- Indexes structure for table TReader
-- ----------------------------
CREATE UNIQUE INDEX [IndexReaderCard] ON [dbo].[TReader]
([Card] ASC) 
GO
CREATE INDEX [IndexReaderName] ON [dbo].[TReader]
([Name] ASC) 
GO

-- ----------------------------
-- Primary Key structure for table TReader
-- ----------------------------
ALTER TABLE [dbo].[TReader] ADD PRIMARY KEY ([ReaderID])
GO

-- ----------------------------
-- Uniques structure for table TReader
-- ----------------------------
ALTER TABLE [dbo].[TReader] ADD UNIQUE ([Card] ASC)
GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[TBook]
-- ----------------------------
ALTER TABLE [dbo].[TBook] ADD FOREIGN KEY ([BookInfoID]) REFERENCES [dbo].[TBookInfo] ([BookInfoID]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[TLend]
-- ----------------------------
ALTER TABLE [dbo].[TLend] ADD FOREIGN KEY ([BookID]) REFERENCES [dbo].[TBook] ([BookID]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
ALTER TABLE [dbo].[TLend] ADD FOREIGN KEY ([ReaderID]) REFERENCES [dbo].[TReader] ([ReaderID]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
