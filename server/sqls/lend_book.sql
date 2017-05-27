-- 查询需要借的图书的是否已被借且还未归还
WITH TExist AS (
	SELECT BookID FROM TBook WHERE BookID = @BookID AND (BookID NOT IN 
		(SELECT TLend.BookID FROM TLend WHERE TLend.BookID = @BookID AND BackTime IS NULL))
)
-- 插入新的记录
INSERT INTO TLend (BookID, ReaderID, LendTime) 
	VALUES ( (SELECT TOP 1 TExist.BookID FROM TExist ), @ReaderID, GETDATE());
