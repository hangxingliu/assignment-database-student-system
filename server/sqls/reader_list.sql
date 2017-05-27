-- 选中读者
WITH TReaders AS (
	SELECT * FROM TReader ORDER BY ReaderID 
	OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY
),
-- 选中借书数量
TLendCount AS (
	SELECT TReaders.ReaderID, Count(LendID) AS LendCount 
	FROM TReaders 
	LEFT JOIN TLend ON TLend.ReaderID = TReaders.ReaderID 
	GROUP BY TReaders.ReaderID
)
-- 合并结果
SELECT TReaders.*, LendCount 
FROM TReaders 
LEFT JOIN TLendCount ON TReaders.ReaderID = TLendCount.ReaderID;