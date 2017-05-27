WITH TLends AS (
	SELECT * FROM TLend ORDER BY LendID DESC OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY
)
SELECT 
	TLends.*,
	TBook.BookInfoID, 
	TBookInfo.BookName, 
	TBook.SerialCode, 
	TReader.Name, 
	TReader.Card 
FROM TLends
INNER JOIN TReader ON TLends.ReaderID = TReader.ReaderID
INNER JOIN TBook ON TLends.BookID = TBook.BookID
INNER JOIN TBookInfo ON TBook.BookInfoID = TBookInfo.BookInfoID