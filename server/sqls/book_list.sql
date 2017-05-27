-- 筛选出属于当前页面显示范围的图书信息
WITH TBookInfos AS (
    SELECT * FROM TBookInfo ORDER BY BookInfoID OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY
), 
-- 选出对应这个图书信息的图书
TBooks AS (
		SELECT * FROM TBook WHERE BookInfoID IN　(SELECT BookInfoID FROM TBookInfos)
), 
-- 对这些图书按照图书信息归类(以获得每本书的数目)
TBooksGroupBy AS (
		SELECT BookInfoID, COUNT(BookInfoID) AS BookCount FROM TBooks GROUP BY BookInfoID
), 
-- 按照图书对应上目前借出去的本数
TLendingCount AS (
		SELECT COUNT(LendID) AS LendingCount, BookInfoID 
		FROM TLend, TBooks 
		WHERE TBooks.BookID = TLend.BookID AND TLend.BackTime IS NULL 
		GROUP BY TBooks.BookInfoID
)

-- 最外层 增加选择 借出的数量
SELECT 
		TResult.*,
		ISNULL(TLendingCount.LendingCount, 0) AS LendingCount
FROM (
		-- 内层 选择 图书信息 和 图书本数
		SELECT 
			TBookInfos.*,
			TBooksGroupBy.BookCount
		FROM TBookInfos 
		LEFT JOIN TBooksGroupBy
		ON TBookInfos.BookInfoID = TBooksGroupBy.BookInfoID
) AS TResult
LEFT JOIN TLendingCount
ON TResult.BookInfoID = TLendingCount.BookInfoID

