WITH TBookID AS (
	SELECT BookID, BookInfoID, SerialCode FROM TBook WHERE SerialCode = @SerialCode
)
SELECT 
	TBookID.BookID,
	TBookID.SerialCode,
	TBookInfo.*,
	TLend.LendID,
	TLend.ReaderID,
	TLend.LendTime,
	TLend.BackTime
FROM TBookID
INNER JOIN TBookInfo ON TBookID.BookInfoID = TBookInfo.BookInfoID
LEFT JOIN TLend ON TLend.BackTime IS NULL AND TBookID.BookID = TLend.BookID