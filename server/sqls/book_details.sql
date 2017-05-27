-- 选出此书的信息
WITH TCureentBookInfo As (
	SELECT TOP 1 * FROM TBookInfo WHERE TBookInfo.BookInfoID = @BookID
),
-- 选出所有书本和借阅信息
TBooks AS (
		SELECT
			TBook.BookID, 
			TBook.SerialCode,
			TCureentBookInfo.*,
			TLend.LendID,
			TLend.ReaderID,
			TLend.LendTime,
			TReader.Name AS ReaderName,
			TReader.Card
		FROM TCureentBookInfo 
		LEFT JOIN TBook ON TCureentBookInfo.BookInfoID = TBook.BookInfoID
		LEFT JOIN TLend ON TLend.BackTime IS NULL AND TBook.BookID = TLend.BookID
		LEFT JOIN TReader ON TLend.ReaderID = TReader.ReaderID
)
SELECT * FROM TBooks;
